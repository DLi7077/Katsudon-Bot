import _ from "lodash";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Gets the first 100 messages for a given channel id
 * @param {string} channel_id the channel id to read messages from
 * @param {number} limit number of messages to read
 * @returns A list of messages and properties
 */
export async function getChannelMessages(
  channel_id: string,
  limit: number = 100
): Promise<any> {
  const url = `https://discord.com/api/channels/${channel_id}/messages?limit=${
    limit ?? ""
  }`;
  const request = {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
    },
  };

  const response = await axios(request).then((res: any) => res.data);
  const messages = response.map((message: any) => {
    if (message.author.bot) return;
    return {
      message: message.content,
      username: message.author.username,
      avatar: message.author.avatar,
    };
  });

  return messages;
}

/**
 * @description sends a message with info to database
 * @param {any} msg a messy message block to be cleaned and sent to server
 */
export async function recordMessage(msg: any) {
  const url = "http://localhost:5000/api/add-message";
  const mentionedUsers = Array.from(msg.mentions.users.keys());
  const mentionedRoles = Array.from(msg.mentions.roles.keys());
  const attachmentAttributes = Array.from(msg.attachments.values())[0];
  const attachmentName = _.get(attachmentAttributes, "name");
  const attachmentSize = _.get(attachmentAttributes, "size");
  const attachmentType = _.get(attachmentAttributes, "contentType");

  const messageBlock = {
    id: _.get(msg, "id"),
    user_id: _.get(msg, "author.id"),
    channel_id: _.get(msg, "channelId"),
    message_content: _.get(msg, "content"),
    message_mentions: {
      users: mentionedUsers,
    },
    attachment_name: attachmentName,
    attachment_size: attachmentSize,
    attachment_type: attachmentType,
  };
  const request = {
    method: "post",
    url: url,
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
    },
    data: messageBlock,
  };

  const response = await axios(request)
    .catch((e) => console.log("something went wrong"));

  return response ?? "error";
}
