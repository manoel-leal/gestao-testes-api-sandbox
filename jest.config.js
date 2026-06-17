module.exports = {
  reporters: [
    "default",
    ["jest-html-reporters", {
      publicPath: "./report",
      filename: "report.html",
      expand: true
    }],
    ["jest-ctrf-json-reporter", {
      outputDir: "./ctrf-report",
      outputFile: "ctrf-report.json"
    }]
  ]
};