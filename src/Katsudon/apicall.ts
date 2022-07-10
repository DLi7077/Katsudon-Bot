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
 * @param {string} msg a messy message block to be cleaned and sent to server
 */
export async function recordMessage(msg: string) {
  const url = "http://localhost:5000/api/add-message";
  const mentionedUserIds = _.map(
    _.get(msg, "MessageMentions.users"),
    (user) => {
      return _.get(msg, "id");
    }
  );
  const messageBlock = {
    id: _.get(msg, "id"),
    user_id: _.get(msg, "author.id"),
    channel_id: _.get(msg, "channelId"),
    message_content: _.get(msg, "content"),
    message_mentions: {
      users: mentionedUserIds,
    },
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
    .then((res: any) => res.data)
    .catch(console.error);

  return response.message;
}
