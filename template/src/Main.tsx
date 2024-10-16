import React from "react";

export const XrmContext = React.createContext<Xrm.XrmStatic | undefined>(undefined);

/* function @getInputProperties
  * Use the properties defined for your widget. 
  * It is possible define new custom properties in your widget.
  * Modify the file properties-schema.json and after that run the script command.
  * More information: "adicionar link com documentação"
*/

import { getInputProperties } from './Index'

const Main: React.FunctionComponent = () => {
 return <div className="bg-white w-full h-full">Welcome! You are ready to start your development</div>;
};

export default Main;
