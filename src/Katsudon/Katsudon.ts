import { Client, Intents } from "discord.js";
import * as dotenv from "dotenv";
import _, { map } from "lodash";
import { recordMessage } from "./Api/message";
import commandList from "./Commands";
dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", (client: any) => {
  console.log("Connected!");
  const guildId = "893771458562629682";
  const guild = client.guilds.cache.get(guildId);
  // const botCommands = client.application?.commands;
  // const botCommands = guild.commands;

  // _.map(commandList, (command) => {
  //   botCommands?.create(command.create);
  // });
});

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const { commandName, options } = interaction;
//   const response = await _.get(commandList, commandName).action(options);
//   await interaction.reply({
//     content: `${response}`,
//     ephemeral: true,
//   });
// });

const previousMessage: Map<string, string> = new Map();



const userHasRole = (roles: string[], role_id: string) => {
  return roles.includes(role_id);
};
const sameAsPreviousMessage = (user_id: string, message_content: string) => {
  const previous = previousMessage.get(user_id) ?? "";
  const sameAsPrev = previous === message_content;
  previousMessage.set(user_id, message_content); //update map

  return sameAsPrev;
};

client.on("messageCreate", async (msg: any) => {
  if (msg.author == client.user) return; //is katsudon
  if (msg.author.bot) return; //is bot

  const messageContent = msg.content;
  const username = msg.author.username;

  const KATSUDONE_ROLE = "1006383172201754704";
  const speakerRoles = _.get(msg, "member._roles");
  if (!userHasRole(speakerRoles, KATSUDONE_ROLE)) {
    console.log(`${username} does not have katsudone. Must not record.`);
    return;
  }

  const user_id = msg.author.id;
  if (sameAsPreviousMessage(user_id, messageContent)) {
    console.log("same as prev");
    return;
  }
  await recordMessage(msg)
    .then((res) =>
      console.log(`recorded ${username} saying:\n${messageContent}\n`)
    )
    .catch(console.error);
});

client.login(process.env.TOKEN);
