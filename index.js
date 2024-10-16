#! /usr/bin/env node

import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

import {getQuestions} from "./questions.js";
import {copyTemplate} from "./copyTemplate.js";
import {modifyConfigFile, modifyPackageJson} from "./changeFiles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
 const {widgetName, widgetDescription, widgetAuthor} = await getQuestions();

 const targetDirectory = path.join(process.cwd(), widgetName);

 fs.mkdirSync(targetDirectory);

 const templateDir = path.join(__dirname, "template");

 copyTemplate(templateDir, targetDirectory);

 modifyConfigFile(targetDirectory, widgetName);

 modifyPackageJson(targetDirectory, widgetName, widgetDescription, widgetAuthor);
}

main().catch((error) => {
 console.log(error);
});
