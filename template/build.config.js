import fs from "fs";
import path from "path";
import ora from "ora";
import chalk from "chalk";

import config from "./config.js";

const spinner = ora({ text: "Generating Widget...", color: "green", spinner: "dots3"}).start();

const outputFilePath = path.resolve("component.config.json");

const isProduction = process.env.NODE_ENV === "production";
const timestamp = new Date().toISOString();

const jsonData = {
 ...config,
 environment: isProduction ? "production" : "development",
 generatedAt: timestamp,
};

const jsonContent = JSON.stringify(jsonData, null, 2);

try {
 await new Promise((resolve) => setTimeout(resolve, 2000));
 fs.writeFileSync(outputFilePath, jsonContent, "utf-8");
 spinner.succeed(chalk.green("Widget generated successfully!"));
} catch (error) {
 spinner.fail(chalk.red("Error generating JSON!"));
 console.error(chalk.red(error));
}
