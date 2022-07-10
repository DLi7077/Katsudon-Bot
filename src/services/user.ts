import _ from "lodash";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * @description Gets a username by their id using discord's API
 * @param {string} user_id The user's ID
 * @returns {string} the username
 */
async function getUserByID(user_id: string) {
  const url = `https://discord.com/api/users/${user_id}`;
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



export { getUserByID };
