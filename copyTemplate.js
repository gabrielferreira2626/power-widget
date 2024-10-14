import fs from "fs";
import path from "path";

const copyTemplate = (source, target) => {
 const items = fs.readdirSync(source);

 items.forEach((item) => {
  const currentSource = path.join(source, item);
  const currentTarget = path.join(target, item);

  if (fs.lstatSync(currentSource).isDirectory()) {
   if (!fs.existsSync(currentTarget)) {
    fs.mkdirSync(currentTarget);
   }
   copyTemplate(currentSource, currentTarget);
  } else {
   fs.copyFileSync(currentSource, currentTarget);
  }
 });
};

export {copyTemplate};
