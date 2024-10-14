import React from "react";

export const XrmContext = React.createContext<Xrm.XrmStatic | undefined>(undefined);

const Main: React.FunctionComponent = () => {
 return <div className="bg-white w-full h-full">Welcome! You are ready to start your development</div>;
};

export default Main;
