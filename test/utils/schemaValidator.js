const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

function validateResponseWithSchema(schemaPath, responseBody) {
  const ajv = new Ajv({ allErrors: true });
  const schemaFile = fs.readFileSync(path.resolve(schemaPath), "utf-8");
  const schema = JSON.parse(schemaFile);

  const validate = ajv.compile(schema);
  const valid = validate(responseBody);

  if (!valid) {
    throw new Error("Schema validation failed: " + JSON.stringify(validate.errors, null, 2));
  }
}

module.exports = { validateResponseWithSchema };