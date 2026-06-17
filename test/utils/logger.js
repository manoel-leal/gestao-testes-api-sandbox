function logRequestResponse({ url, headers, body }, response) {
  console.log("=== REQUEST ===");
  console.log("URL:", url);
  console.log("Headers:", headers);
  console.log("Body:", body);

  console.log("=== RESPONSE ===");
  console.log("Status:", response.statusCode);
  console.log("Body:", response.body);
}

module.exports = { logRequestResponse };