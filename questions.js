import inquirer from "inquirer";

export async function getQuestions() {
 const questions = inquirer.prompt([
  {
   type: "input",
   name: "widgetName",
   message: "Widget Name:",
   required: true,
  },
  {
   type: "input",
   name: "widgetDescription",
   message: "Widget Description:",
   default: "",
   required: false,
  },
  {
   type: "input",
   name: "widgetAuthor",
   message: "Author:",
   default: "",
   required: false,
  },
 ]);

 return questions;
}
