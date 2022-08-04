import { addCommand } from "./math";
import { NaiveBayesCommand } from "./machineLearning";

const commands = {
  add: addCommand,
  ...NaiveBayesCommand,
};
console.log(commands);

export default commands;
