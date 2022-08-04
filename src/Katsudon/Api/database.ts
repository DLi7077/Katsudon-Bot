import _ from "lodash";
import axios from "axios";

async function getUserStats(queryParams: any = {}): Promise<any> {
  const request = {
    method: "get",
    url: "http://localhost:5000/api/user-stats",
    params: queryParams,
  };

  const response = await axios(request)
    .then((res: any) => res.data)
    .catch(console.error);

  return response;
}

async function getMessages(): Promise<any> {
  const request = {
    method: "get",
    url: "http://localhost:5000/api/all-messages",
    params: {
      user_id: "153168441488965632",
    },
  };

  const response = await axios(request)
    .then((res: any) => res.data)
    .catch(console.error);

  return response;
}

export default {
  getUserStats,
  getMessages,
};
