// jest.config.js
module.exports = {
  reporters: [
    "default",
    ["jest-html-reporters", {
      publicPath: "./report",
      filename: "report.html",
      expand: true
    }]
  ]
};