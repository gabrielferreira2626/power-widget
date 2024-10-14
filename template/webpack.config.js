import webpack from "webpack";
import ZipPlugin from "zip-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import WebpackBar from "webpackbar";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
 plugins: [
  new WebpackBar({name: "Widget"}),
  new webpack.EnvironmentPlugin({
   "process.env.NODE_ENV": process.env.NODE_ENV,
  }),
  new CopyWebpackPlugin({
   patterns: [
    {
     from: "./src/Assets/Preview/",
     to: "preview/",
     noErrorOnMissing: true,
    },
    {
     from: "./component.config.json",
     to: "config/",
    },
   ],
  }),
  new ZipPlugin({
   filename: "widget.zip",
   path: "generated",
  }),
 ],
 entry: {
  main: "./src/Main.tsx",
 },
 output: {
  filename: "widget.js",
  libraryTarget: "commonjs",
  path: path.resolve(__dirname, "dist"),
 },
 resolve: {
  extensions: [".ts", ".tsx", ".js"],
 },
 module: {
  rules: [
   {
    test: /.tsx?$/,
    exclude: /(node_modules|bower_components)/,
    use: {
     loader: "ts-loader",
    },
   },
   {
    test: /.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
     loader: "babel-loader",
    },
   },
   {
    test: /.(png|jpe?g|gif|svg)$/i,
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
