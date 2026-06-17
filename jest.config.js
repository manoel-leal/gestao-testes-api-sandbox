module.exports = {
  reporters: [
    "default",
    ["jest-html-reporters", {
      publicPath: "./report",
      filename: "report.html",
      expand: true
    }],
    ["./test/utils/ctrf-reporter.js", {
      outputDir: "./ctrf-report",
      outputFile: "ctrf-report.json"
    }]
  ]
};