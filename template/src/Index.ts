import fs from "fs";
import path from "path";

import {InputWidgetProperties} from "./Interfaces/InputProperties";

export const getInputProperties = (): InputWidgetProperties => {
 const schemaPath = path.join(__dirname, "properties-schema.json");
 const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

 const props: Partial<InputWidgetProperties> = {};
 for (const key in schema.properties) {
  if (schema.properties[key].default !== undefined) {
   props[key as keyof InputWidgetProperties] = schema.properties[key].default;
  } else {
   if (schema.properties[key].type === "string") {
    props[key as keyof InputWidgetProperties] = "" as any;
   } else if (schema.properties[key].type === "number") {
    props[key as keyof InputWidgetProperties] = 0 as any;
   } else if (schema.properties[key].type === "boolean") {
    props[key as keyof InputWidgetProperties] = false as any;
   }
  }
 }

 return props as InputWidgetProperties;
};
