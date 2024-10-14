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

export {modifyPackageJson};
