# Stargate

This service is utilized by all E&B Solutions' deployed applications.

## Usage:

You will need to create the `secrets.json` file in the root of the directory with the value shown below:

```json
{
  "DOMAIN": "example.com"
}
```

### Endpoints:

- /health
  - GET
  - Verifies the gateway is alive and reachable
- /email
  - POST
  - Send email from users of deployed apps to business contact of company
- /email-with-attachment
  - POST
  - Send email with attachment from users of deployed apps to business contact of company
