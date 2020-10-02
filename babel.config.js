module.exports = api => {
  const config = {
    presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    ignore: []
  };

  // You can use isTest to determine what presets and plugins to use.
  const isTest = api.env("test");

  if (!isTest) {
    config.ignore.push("**/*.spec.js");
  }

  return config;
};
