import fs from "fs";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import Ajv from "ajv";

import config from "./config.js";

const spinner = ora({text: "Generating Widget...", color: "green", spinner: "dots3"}).start();

const outputFilePath = path.resolve("component.config.json");

const isProduction = process.env.NODE_ENV === "production";
const timestamp = new Date().toISOString();

if (config.logicalName === "") {
 throw new Error("You need to set a logical name in the config.js file");
}

if (config.displayName === "") {
 config.displayName = config.logicalName;
}

const jsonData = {
 ...config,
 environment: isProduction ? "production" : "development",
 generatedAt: timestamp,
};

const schemaFilePath = path.resolve("src/properties-schema.json");
const schemaContent = JSON.parse(fs.readFileSync(schemaFilePath, "utf-8"));

const ajv = new Ajv();
const validate = ajv.compile(schemaContent);

if (!validate) {
  spinner.fail(chalk.red("Validation error in generated JSON!"));
  console.error(chalk.red(validate.errors.toString()));
  process.exit(1);
}

const jsonContent = JSON.stringify(jsonData, null, 2);

try {
 await new Promise((resolve) => setTimeout(resolve, 2000));
 fs.writeFileSync(outputFilePath, jsonContent, "utf-8");
 spinner.succeed(chalk.green("Widget generated successfully!"));
} catch (error) {
 spinner.fail(chalk.red("Error generating JSON!"));
 console.error(chalk.red(error));
}
