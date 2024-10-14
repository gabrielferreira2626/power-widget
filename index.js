#! /usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import prettier from "prettier";

const __filename = fileURLToPath(import.meta.url);

function createDirectoryIfNotExists(directoryPath) {
 if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, {recursive: true});
 }
}

async function writeFileIfNotExists(filePath, content) {
 if (!fs.existsSync(filePath)) {
  try {
   let formattedContent = content;
   if (filePath.endsWith(".json") || filePath === ".babelrc") {
    formattedContent = await prettier.format(content, {parser: "json"});
   } else if (filePath.endsWith(".html")) {
    formattedContent = await prettier.format(content, {parser: "html"});
   } else if (filePath.endsWith(".js") || filePath.endsWith(".jsx") || filePath.endsWith(".tsx")) {
    const parser = filePath.endsWith(".tsx") || filePath.endsWith(".jsx") ? "babel-ts" : "babel";
    formattedContent = await prettier.format(content, {parser});
   } else if (filePath.endsWith(".css")) {
    formattedContent = await prettier.format(content, {parser: "css"});
   }

   fs.writeFileSync(filePath, formattedContent, "utf8");
  } catch (error) {
   console.error(`Error formatting file ${filePath}:`, error);
   fs.writeFileSync(filePath, content, "utf8");
  }
 }
}

async function main() {
 const questions = await inquirer.prompt([
  {
   type: "input",
   name: "widget_name",
   message: "Widget name:",
   default: "widget-project",
  },
  {
   type: "confirm",
   name: "install_tailwind",
   message: "Do you want to install Tailwind CSS?",
   default: false,
  },
 ]);

 const {widget_name, install_tailwind} = questions;

 const projectPath = path.resolve(process.cwd(), widget_name);
 const srcPath = path.join(projectPath, "src");
 const assetsPath = path.join(srcPath, "Assets");
 const previewPath = path.join(assetsPath, "Preview");

 [projectPath, srcPath, assetsPath, previewPath].forEach(createDirectoryIfNotExists);

 const pascalCaseWidgetName = widget_name
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("");

 const widgetNameSnakeCase = widget_name
  .replace(/([a-z])([A-Z])/g, "$1_$2")
  .replace(/[- ]+/g, "_")
  .toLowerCase();
 const widgetNameSeparate = widget_name
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/[_-]+/g, " ")
  .replace(/\s+/g, " ")
  .toLowerCase()
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

 // Criar arquivos necessários
 writeFileIfNotExists(
  path.join(srcPath, "Index.html"),
  `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>`.trim()
 );

 writeFileIfNotExists(
  path.join(srcPath, "Index.tsx"),
  `import { ${pascalCaseWidgetName} } from "./${pascalCaseWidgetName}"; export default ${pascalCaseWidgetName};`
 );

 writeFileIfNotExists(
  path.join(srcPath, `${pascalCaseWidgetName}.tsx`),
  `
    import React from "react";
    export const XrmContext = React.createContext<Xrm.XrmStatic | undefined>(undefined);
    const ${pascalCaseWidgetName}: React.FunctionComponent = () => {
      return (
        <div className="w-full h-full bg-white">
          <div>You are in development mode</div>
        </div>
      );
    };
    export { ${pascalCaseWidgetName} };
  `.trim()
 );

 writeFileIfNotExists(
  path.join(projectPath, ".babelrc"),
  `{
  "presets": [
    [
    "@babel/preset-env",
    {
      "useBuiltIns": "usage",
      "corejs": 3,
      "debug": false
    }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
    "@babel/plugin-transform-runtime",
    {
      "regenerator": true
    }
    ],
    [
    "@babel/plugin-proposal-class-properties",
    {
      "loose": true
    }
    ],
    [
    "transform-react-remove-prop-types",
    {
      "removeImport": true
    }
    ]
  ],
  "env": {
    "development": {
    "sourceMaps": true,
    "retainLines": true
    },
    "test": {
    "sourceMaps": true,
    "retainLines": true
    }
  }
  }
  `
 );

 writeFileIfNotExists(
  path.join(projectPath, ".gitignore"),
  `
/node_modules`
 );

 writeFileIfNotExists(
  path.join(projectPath, "remote-component.config.js"),
  `
    import React from "react";
    export const resolve = {
      react: React,
    };
  `
 );

 writeFileIfNotExists(
  path.join(projectPath, "config.js"),
  `
    const config = {
      logicalName: "${widgetNameSnakeCase}",
      displayName: "${widgetNameSeparate}",
      version: 1.00,
      previewImageComponent: "./src/Assets/Preview/",
    };

    export default config;
  `.trim()
 );

 writeFileIfNotExists(
  path.join(projectPath, "build.config.js"),
  `
    import fs from "fs";
    import path from "path";
    import ora from "ora";
    import chalk from "chalk";

    import config from "./config.js";

    const spinner = ora({
      text: "Generating widget properties from Widget:${widgetNameSeparate}...",
      color: 'green',
      spinner: 'dots3',
    }).start();

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      fs.writeFileSync(outputFilePath, jsonContent, "utf-8");
      spinner.succeed(chalk.green('Widget properties generated successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('Error generating JSON!'));
      console.error(chalk.red(error));
    }
  `
 );

 writeFileIfNotExists(
  path.join(projectPath, "tsconfig.json"),
  `{
      "compilerOptions": {
        "target": "ES5",
        "module": "ESNext",
        "jsx": "react",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "Node"
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules"]
    }`
 );

 writeFileIfNotExists(
  path.join(projectPath, "webpack.config.js"),
  `
    import webpack from "webpack";
    import ZipPlugin from "zip-webpack-plugin";
    import CopyWebpackPlugin from "copy-webpack-plugin";
    import WebpackBar from "webpackbar";
    import { fileURLToPath } from "url";
    import path from "path";

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    export default {
      plugins: [
        new WebpackBar({ name: "Widget: ${widgetNameSeparate}" }),
        new webpack.EnvironmentPlugin({
          "process.env.NODE_ENV": process.env.NODE_ENV,
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "./src/Assets/Preview/",
              to: "preview/",
            },
            {
              from: "./component.config.json",
              to: "config/",
            },
          ],
        }),
        new ZipPlugin({
          filename: "widget-${widgetNameSnakeCase}.zip",
          path: "generated",
        }),
      ],
      entry: {
        main: "./src/Index.tsx",
      },
      output: {
        filename: "${widgetNameSnakeCase}.js",
        libraryTarget: "commonjs",
        path: path.resolve(__dirname, "dist"),
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js"],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: "ts-loader",
            },
          },
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: "babel-loader",
            },
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
                options: {
                  name: "[name].[ext]",
                  outputPath: "preview/",
                  publicPath: "preview/",
                },
              },
            ],
          },
        ],
      },
    };
  `.trim()
 );

 /* "tailwindcss": "^3.4.4", */
 if (install_tailwind === true) {
  writeFileIfNotExists(
   path.join(projectPath, "package.json"),
   `{
        "name": "${widgetNameSeparate}",
        "version": "1.0.0",
        "type": "module",
        "description": "",
        "private": true,
        "author": "",
        "scripts": {
          "build": "node build.config.js && cross-env NODE_ENV=production webpack --mode production && rimraf component.config.json"
        },
        "dependencies": {
          "react": "^18.0.0"
        },
        "devDependencies": {
          "@babel/cli": "^7.25.6",
          "@babel/core": "^7.25.2",
          "@babel/plugin-proposal-class-properties": "^7.12.1",
          "@babel/plugin-transform-runtime": "^7.25.4",
          "@babel/preset-env": "^7.25.4",
          "@babel/preset-react": "^7.24.7",
          "@babel/preset-typescript": "^7.24.7",
          "@babel/runtime": "^7.25.6",
          "@paciolan/eslint-config-react": "^1.0.4",
          "@paciolan/remote-component": "^2.13.0",
          "@types/react": "^18.3.9",
          "@types/react-dom": "^18.3.0",
          "babel-eslint": "^10.1.0",
          "babel-loader": "^9.2.1",
          "babel-plugin-transform-react-remove-prop-types": "^0.4.24",
          "chalk": "^5.3.0",
          "copy-webpack-plugin": "^12.0.2",
          "core-js": "^3.38.1",
          "cross-env": "^7.0.3",
          "eslint": "^9.11.1",
          "eslint-plugin-babel": "^5.3.1",
          "eslint-plugin-react": "^7.36.1",
          "html-webpack-plugin": "^5.6.0",
          "ora": "^8.1.0",
          "react-dom": "^18.3.1",
          "rimraf": "^6.0.1",
          "ts-loader": "^9.5.1",
          "typescript": "^5.6.2",
          "webpack": "^5.94.0",
          "webpack-assets-manifest": "^5.2.1",
          "webpack-bundle-analyzer": "^4.10.2",
          "webpack-cli": "^5.1.4",
          "webpack-dashboard": "^3.3.8",
          "webpack-dev-server": "^5.1.0",
          "webpackbar": "^6.0.1",
          "zip-webpack-plugin": "^4.0.1",
          "tailwindcss": "^3.4.4",
          "@types/xrm": "^9.0.81"
        }
      }`
  );

  writeFileIfNotExists(
   path.join(projectPath, "postcss.config.js"),
   `export default {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    }`
  );

  writeFileIfNotExists(
   path.join(projectPath, "tailwind.config.js"),
   `/** @type {import('tailwindcss').Config} */
      export default {
        content: ["./src/**/*.{ts,tsx}"],
        theme: {
        extend: {
          fontFamily: {
            primary: ["Segoe UI"],
          },
        },
        },
        plugins: [],
      };
    `
  );

  writeFileIfNotExists(
   path.join(srcPath, "Index.css"),
   `@tailwind base;
    @tailwind components;
    @tailwind utilities;
  `
  );
 } else {
  writeFileIfNotExists(
   path.join(projectPath, "package.json"),
   `{
        "name": "${widgetNameSeparate.toLowerCase()}",
        "version": "1.0.0",
        "type": "module",
        "description": "",
        "private": true,
        "author": "",
        "scripts": {
          "build": "webpack --mode production"
        },
        "dependencies": {
          "react": "^18.0.0"
        },
        "devDependencies": {
          "@babel/core": "^7.0.0",
          "@babel/preset-env": "^7.0.0",
          "@babel/preset-react": "^7.0.0",
          "@babel/preset-typescript": "^7.0.0",
          "babel-loader": "^8.0.0",
          "copy-webpack-plugin": "^11.0.0",
          "file-loader": "^6.0.0",
          "ts-loader": "^9.0.0",
          "typescript": "^4.0.0",
          "webpack": "^5.0.0",
          "webpack-cli": "^4.0.0",
          "zip-webpack-plugin": "^4.0.1",
          "@types/react": "^18.3.11",
          "@types/xrm": "^9.0.81",
          "webpackbar": "^6.0.1"
          
        }
      }`
  );
 }
}

main().catch((error) => {
 console.error("Error:", error);
 process.exit(1);
});
