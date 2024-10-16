import fs from "fs";
import path from "path";

const modifyPackageJson = (targetDirectory, projectName, projectDescription, projectAuthor) => {
 const packageJsonPath = path.join(targetDirectory, "package.json");

 if (fs.existsSync(packageJsonPath)) {
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");

  const packageJson = JSON.parse(packageJsonContent);

  packageJson.name = projectName.toLowerCase();
  packageJson.version = "1.0.0";
  packageJson.description = projectDescription;
  packageJson.author = projectAuthor;

  const modifiedPackageJsonContent = JSON.stringify(packageJson, null, 2);

  fs.writeFileSync(packageJsonPath, modifiedPackageJsonContent);
 }
};

const modifyConfigFile = (targetDirectory, projectName) => {
 const configFilePath = path.join(targetDirectory, "config.js");

 if (fs.existsSync(configFilePath)) {
  let configJsContent = fs.readFileSync(configFilePath, "utf-8");

  configJsContent = configJsContent.replace(/logicalName: ""/, `logicalName: "${projectName.toLowerCase()}"`);
  configJsContent = configJsContent.replace(/displayName: ""/, `displayName: "${projectName}"`);

  fs.writeFileSync(configFilePath, configJsContent);
 }
};

export {modifyPackageJson, modifyConfigFile};
