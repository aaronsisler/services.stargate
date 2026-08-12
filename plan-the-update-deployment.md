# Stargate Serverless Upgrade — Comparison Plan

## Context

`stargate` (the email/API gateway service at `services.eandbsolutions.com`) is currently deployed with **Serverless Framework v3.40.0** (devDependency `^3.40.0`), which is end-of-life, while the Lambda runtime is already `nodejs24.x` — a version/runtime mismatch that's the real forcing function for this upgrade. The only plugin in use is `serverless-domain-manager` (`^4.2.0`, installed `4.2.3`).

The blocker worth naming up front: **Serverless Framework v4 requires every user — free or paid — to authenticate the CLI through a serverless.com account.** This was confirmed via the framework's own docs (see Option A). It's free for orgs under $2M revenue and doesn't require adding `org:`/`app:` fields to the config, but the account-creation step itself is mandatory and can't be skipped. That's the concern driving this comparison: this document lays out (A) what it takes to accept that trade and upgrade in place, and (B) what it takes to avoid it entirely by dropping the Serverless Framework and driving AWS directly via CloudFormation + the AWS CLI. No code changes are made in this session — this is a decision document for you to pick from later.

---

## Current State (verified)

- Two hand-maintained, near-duplicate config files: [deployment/serverless.beta.yaml](deployment/serverless.beta.yaml) and [deployment/serverless.prod.yaml](deployment/serverless.prod.yaml), copied to root `./serverless.yaml` at deploy time by [scripts/with-config.sh](scripts/with-config.sh) (this is what the recent "yml → yaml" commits were about).
- `provider`: `nodejs24.x`, `us-east-1`, `logRetentionInDays: 14`, a pre-existing IAM role ARN (`arn:aws:iam::654918520080:role/API-LAMBDA-SES`, not created by the stack), a `usagePlan` (500/month quota, burst 20/rate 10 throttle), and a `resourcePolicy` allowing public `execute-api:Invoke` on GET/POST/OPTIONS.
- 5 functions on one REST API: `info` (GET /info), `email` (POST /email), `email-v2` (POST /email/v2), `email-with-attachment` (POST /email-with-attachment), `email-with-attachment-v2` (POST /email-with-attachment/v2). CORS headers come from [deployment/cors.json](deployment/cors.json).
- **Pre-existing drift bug, independent of either option**: `serverless.prod.yaml`'s `email-v2` is missing the `cors:` block that beta and the other 3 email functions have (lines 48-53 vs. beta's lines 48-56).
- Custom domain (`services.eandbsolutions.com`, per-stage basePath `beta`/`prod`) is entirely managed by `serverless-domain-manager` — no manual ACM/Route53/API Gateway domain resources exist today.
- No `frameworkVersion`, `org`, or `app` field anywhere. No raw CloudFormation `resources:` block. No nested `package.json`.
- Handlers deploy from built `dist/` (via `tsc`), which mirrors `src/`'s layout: `src/{info,email,email-v2,email-with-attachment,email-with-attachment-v2}/` each import shared code from `src/shared/` (auth, email service, validation, logging, etc.). `tsconfig.json`'s `rootDir: src` means `dist/shared/` is a sibling of each function's output dir — every function's handler needs `dist/shared/` present alongside it in the deploy package.
- CI ([.github/workflows/ci.yaml](.github/workflows/ci.yaml)): PRs deploy to beta, pushes to `main` deploy to prod, both via `npm run deploy -- <stage>` → `scripts/with-config.sh` → `sls deploy`. The Deploy step's only env vars today are `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` — no Serverless Dashboard secret exists anywhere.

---

## Option A — Upgrade in place: Serverless Framework v4 + serverless-domain-manager v10

Accepts the one-time free account trade to keep the low-maintenance, plugin-driven workflow.

### Dependency changes (`package.json`)
- `serverless`: `^3.40.0` → exact-pin a current v4 release (e.g. `"4.34.0"`), not caret — a major-version jump deserves a deliberate pin, not implicit minor drift.
- `serverless-domain-manager`: `^4.2.0` → exact-pin `"10.1.0"` (or later). **v4.2.3 (installed today) does not support Serverless Framework v4 as a peer dependency — only recent releases (~v8+) do.** After `npm install`, check the plugin's `peerDependencies` to confirm it accepts `serverless ^4.x`.
- Regenerate and commit `package-lock.json`.
- No `custom.customDomain` schema changes needed in either yaml file — `domainName`/`basePath`/`stage`/`createRoute53Record` all remain valid between plugin v4.x and v10.x per its changelog.

### Config changes
- Add `frameworkVersion: "4"` near the top of both [deployment/serverless.beta.yaml](deployment/serverless.beta.yaml) and [deployment/serverless.prod.yaml](deployment/serverless.prod.yaml) — guards against an ambiguous mismatched local/global `sls` install now that auth is in play.
- Do **not** add `org:`/`app:` fields — those opt into paid Dashboard monitoring features that aren't needed; a free Access Key alone satisfies the CLI auth gate.
- Fix the `email-v2` prod CORS drift as a clearly separate, labeled change (own commit) — bundling a behavior fix into the version bump muddies rollback signal if something breaks.
- Optional cleanup, not required: `serverless-domain-manager` is currently listed under `dependencies` instead of `devDependencies` in `package.json` — fine to leave as-is.

### One-time account setup
1. Create a free serverless.com account (or log in under the org).
2. Generate an **Access Key** from the Dashboard (not a License Key — that's only for $2M+ ARR orgs).
3. Test locally first: `export SERVERLESS_ACCESS_KEY=<key>` and run a beta deploy via the existing `npm run deploy -- beta` flow before touching CI.
4. Add `SERVERLESS_ACCESS_KEY` as a GitHub repo secret, and add it to the Deploy step's `env:` block in [.github/workflows/ci.yaml](.github/workflows/ci.yaml) (currently lines 61-65) alongside the two existing AWS secrets. No other workflow changes needed.

### Risks
- New external failure mode: a serverless.com outage or Access Key issue can block deploys even when nothing in your own infra changed.
- `serverless-domain-manager` v10's cert/domain lookup internals may behave slightly differently even with an unchanged config schema — this touches a live DNS-facing domain, so verify before prod.
- Confirm v4's native esbuild TS bundling doesn't try to activate — shouldn't, since this repo pre-builds via `tsc` and packages `dist/`, but worth a smoke test.

### Rollback
Exact pins make a revert a single `git revert` of the version-bump commit. Framework state lives in the CloudFormation stack itself (not locally), so a version revert + redeploy is a legitimate rollback path. Deploy beta first via the normal PR flow, verify, then merge to trigger prod — don't let prod be the first real v4 execution.

### Verification (before merging to prod)
1. Beta deploy succeeds in CI.
2. `curl https://services.eandbsolutions.com/beta/info` returns 200 with correct time/`APP_VERSION`.
3. Custom domain resolves correctly through the `serverless-domain-manager` v10 mapping (not just the raw `execute-api` URL) — highest-risk surface of this change.
4. `curl -i -X OPTIONS` against all CORS-enabled routes confirms headers match [deployment/cors.json](deployment/cors.json).
5. `aws apigateway get-usage-plans` confirms quota/throttle values and stage association survived the regenerated CloudFormation template.
6. Repeat 1-5 against prod after merge.

---

## Option B — Replace Serverless Framework with AWS CLI + hand-written CloudFormation

Avoids any serverless.com account, permanently, at the cost of a meaningfully larger and more manually-maintained template.

### Structure
```
infra/
  template.yaml                # single CFN template, parameterized by Stage
  parameters/beta.json
  parameters/prod.json
scripts/
  deploy-infra.sh               # replaces scripts/with-config.sh
  bootstrap-artifacts-bucket.sh # one-time S3 bucket for packaged Lambda zips
```
`deployment/serverless.*.yaml` and the `with-config.sh` copy trick are retired. `deployment/cors.json`'s header list moves inline into the template's CORS response blocks (CloudFormation has no file-include mechanism).

### Template contents (`infra/template.yaml`)
- **Parameters**: `Stage` (beta/prod), `LambdaExecutionRoleArn` (the existing external ARN, kept as a parameter, not CFN-managed), `DomainCertificateArn`, `HostedZoneId`, `ArtifactsBucketName`, plus per-stage `NodeEnv`/`BasePath` values from `infra/parameters/<stage>.json`. Beta/prod differences here are pure value substitution — no `Conditions` needed.
- **Per function (×5)**: `AWS::Lambda::Function` (`Runtime: nodejs24.x`, `Role: !Ref LambdaExecutionRoleArn`), `AWS::Lambda::Permission` (API Gateway invoke — implicit under Framework, must be explicit here), `AWS::Logs::LogGroup` with `RetentionInDays: 14` declared explicitly (must exist *before* the function or Lambda auto-creates an unmanaged, non-expiring log group — a common CFN gotcha).
- **Packaging**: since `tsconfig.json` has `rootDir: src` / `outDir: dist`, every function's handler needs `dist/shared/` alongside its own `dist/<name>/` output. Simplest correct approach: package the **entire `dist/` directory as one zip**, reused as the `Code` source for all 5 functions — this mirrors Framework's own default (non-`individually`) packaging behavior and sidesteps having to hand-compute per-function dependency subsets.
- **API Gateway** (REST API, matching today's usage-plan/resource-policy requirement — HTTP APIs don't support either): one `AWS::ApiGateway::RestApi` with the resource policy inlined, `AWS::ApiGateway::Resource` per path segment (note `/email/v2` and `/email-with-attachment/v2` need nested resources), `AWS::ApiGateway::Method` per route (`AWS_PROXY` integration), and — the most verbose part — a hand-built `OPTIONS`+`MOCK` integration per CORS-enabled resource (4 of 5; `/info` has none) with matching `IntegrationResponses`/`MethodResponses` for the CORS headers. Framework's `cors:` shorthand is doing substantially more generated work here than it appears to.
- **Deployment/Stage**: `AWS::ApiGateway::Deployment` needs `DependsOn` listing every Method (CFN doesn't reliably auto-track Method changes) and a logical ID that changes per deploy (timestamp/hash) to force actual redeployment. `AWS::ApiGateway::Stage` references it.
- **Usage plan**: `AWS::ApiGateway::UsagePlan` with the same quota/throttle values, `ApiStages` pointing at the stage. No API key resources needed — today's plan is public-but-throttled (`Principal: "*"`), not per-key metered.
- **Custom domain**: `AWS::ApiGateway::DomainName` + `AWS::ApiGateway::BasePathMapping` + `AWS::Route53::RecordSet` (alias). **The ACM certificate is not created by this template** — it must be found via a one-time `aws acm list-certificates --region us-east-1` lookup (today `serverless-domain-manager` discovers this automatically) and hardcoded into both parameter files. If the cert is ever *replaced* (not just auto-renewed, which keeps the same ARN), the parameter files need a manual update — a real ongoing maintenance delta versus Option A.
- Fixing the `email-v2` CORS drift is moot here — a single parameterized template structurally can't have prod/beta diverge by accident the way two hand-copied files did; just build the OPTIONS block for `email-v2` like the other 3 email routes.

### Build/deploy pipeline (replaces `with-config.sh` + `sls deploy`)
1. One-time, manual, not in CI: `aws s3 mb s3://stargate-cfn-artifacts-<account-id>` (versioned).
2. `npm run build` (`tsc`, unchanged).
3. Zip `dist/` → `aws cloudformation package --template-file infra/template.yaml --s3-bucket <bucket> --output-template-file infra/packaged-template.yaml` (uploads the zip, rewrites `Code.S3Bucket`/`S3Key`).
4. `aws cloudformation deploy --template-file infra/packaged-template.yaml --stack-name stargate-<stage> --parameter-overrides file://infra/parameters/<stage>.json --capabilities CAPABILITY_IAM`.
5. Wrap 2-4 in `scripts/deploy-infra.sh <stage>`, called from `package.json`'s `deploy` script exactly as today (`npm run deploy -- beta`).
6. `delete` script becomes `aws cloudformation delete-stack --stack-name stargate-<stage>`.

### CI changes ([.github/workflows/ci.yaml](.github/workflows/ci.yaml))
No new secrets — the existing `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` cover everything, though the attached IAM policy needs to be verified broad enough for direct `cloudformation:*`/`apigateway:*`/`lambda:*`/`logs:*`/`route53:*`/`s3:*` (on the artifacts bucket)/`iam:PassRole` calls, since Framework may have been operating under different effective permissions. The Deploy step's shape (conditional beta/prod stage arg) is otherwise unchanged.

### Size and maintenance estimate
Roughly 400-600 lines of YAML for `infra/template.yaml` — about 5-8x today's two ~95-line files combined, since Framework's `http`/`cors:` shorthand is doing real code generation under the hood. Every new route going forward means manually adding Function + Permission + LogGroup + Resource + Method (+ CORS OPTIONS block) + updating the Deployment's `DependsOn` — versus a few-line Framework `functions:` entry. No plugin ecosystem for anything added later (WAF, API keys, custom authorizers, etc.) — all hand-built if ever needed. The upside is durable: **zero external-account dependency, ever**, and `aws cloudformation deploy` has no forced-migration risk the way Framework v3→v4 did.

### Verification
Because this is a full rewrite rather than a version bump, deploy to a **net-new stack name** (e.g. `stargate-beta-v2`) first, leaving the current Framework-managed `stargate-beta` live as a fallback:
1. Stack reaches `CREATE_COMPLETE`.
2. Same `curl` checks as Option A against the raw `execute-api` URL first (before DNS cutover) — Lambda integration, IAM role invocation, env vars.
3. CORS `OPTIONS` checks against all 4 CORS routes on the raw URL — highest-defect area given the hand-built MOCK integration.
4. `aws apigateway get-usage-plans` for quota/throttle values, then actually burst requests past the throttle to confirm `429`s appear — worth doing explicitly since this is newly hand-built, not a known-working carry-over.
5. Only after 1-4 pass, cut over the **beta** `BasePathMapping`/Route53 record to the new stack, leaving prod's domain mapping untouched, and re-verify `services.eandbsolutions.com/beta/*` end to end.
6. `aws logs describe-log-groups` confirms `retentionInDays: 14` per function (catches the missed-LogGroup-resource gotcha).
7. After a soak period, repeat for prod, then decommission the old `stargate-beta`/`stargate-prod` Framework stacks and remove `serverless`/`serverless-domain-manager` from `package.json`.

---

## Comparison

| | Option A (upgrade in place) | Option B (CloudFormation + AWS CLI) |
|---|---|---|
| External account ever required | Yes, one-time, free (until $2M ARR) | No, never |
| Migration effort | Small — version bumps + one CI secret | Large — full template rewrite, ACM lookup, CORS hand-built |
| Ongoing maintenance | Low — Framework generates CFN, plugin handles domain/cert | Higher — every route/plugin-equivalent feature hand-built |
| Future risk | Another forced business-model change from Serverless Inc. is possible | None — AWS CLI/CloudFormation has no vendor lock-in risk |
| Best fit if... | You want to keep shipping fast and a free account is an acceptable one-time trade | The goal is permanently removing any third-party SaaS auth dependency from deploys |

No implementation was performed in this session — this document is for you to decide between the two paths (or defer the decision) before either is executed.
