import { Constants } from "discord.js";

const addCreate = {
  name: "add",
  description: "adds 2 numbers",
  options: [
    {
      name: "x",
      description: "x",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
    },
    {
      name: "y",
      description: "y",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
    },
  ],
};

function performAdd(options: any): string {
  const x = options.getNumber("x");
  const y = options.getNumber("y");
  return `${x} + ${y} = ${x + y}`;
}

export const addCommand = {
  create: addCreate,
  action: performAdd,
};
