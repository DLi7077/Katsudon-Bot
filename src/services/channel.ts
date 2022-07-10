import _ from "lodash";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * @description Gets a username by their id using discord's API
 * @param {string} channel_id The channels's ID
 * @returns {string} the username
 */
async function getChannelById(channel_id: string) {
  const url = `https://discord.com/api/channels/${channel_id}`;
  const request = {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
    },
  };

  const response = await axios(request)
    .then((res: any) => res.data)
    .catch(console.error);

  return response.username;
}

export { getChannelById };
