import { recordMessage } from "./apicall";
import { getUserByID } from "../services/user";
import _ from "lodash";
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
require("dotenv").config();

client.on("ready", (client: any) => {
  console.log("Connected!");
});

client.on("messageCreate", async (msg: any) => {
  if (msg.author == client.user) return;
  if (msg.author.bot) return;

  console.log(msg.mentions);
  console.log(_.omit(msg, "mentions"));
  const messageContent = msg.content;
  const username = await getUserByID(msg.author.id);

  // await msg.channel.send(`${username} said: ${messageContent}`);
  await recordMessage(msg).then((res) => console.log(res));
  console.log(`recorded ${username} saying:\n${messageContent}\n`);
});

client.login(process.env.TOKEN);
