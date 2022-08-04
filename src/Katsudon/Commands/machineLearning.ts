import { Constants } from "discord.js";
import _ from "lodash";
import database from "../Api/database";
import distribution from "../../utils/wordDistribution";
import discordService from "../Api/discord";

const COMMAND_FIELD = "sentence";
const COMMAND_NAME = "guess-speaker";

const createNaiveBayes = {
  name: COMMAND_NAME,
  description: "guesses the speaker of a sentence",
  options: [
    {
      name: COMMAND_FIELD,
      description: "who said this?",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],
};

/**
 * @description Retrieves a sentence and gueses the user that said it
 * @param {any} options - the command inputs
 * @returns {string} user_id
 */
async function performNaiveBayes(options: any): Promise<string> {
  const sentence: string = options.getString(COMMAND_FIELD);
  const userStats = await database.getUserStats().catch(console.error);

  const sentenceWordFreq: any = distribution.getWordDistribution(sentence);
  const total_message_count = _.get(userStats, "message_count");
  const users = _.get(userStats, "users");

  const initialLikelihood: any[] = _.map(users, (user_stats, user_id) => {
    const user_message_count = _.get(user_stats, "message_count");
    return {
      user_id: user_id,
      message_count: user_message_count,
      likelihood: user_message_count / total_message_count,
    };
  });

  const updatedLikelihood: any[] = _.map(initialLikelihood, (user: any) => {
    const { user_id, likelihood } = user;
    const user_stat = users[user_id];
    const user_word_distribution = _.get(user_stat, "word_distribution");
    const user_message_count = _.get(user_stat, "message_count");

    if (user_message_count < 10) {
      return {
        user_id: user_id,
        message_count: user_message_count,
        likelihood: 0,
      };
    }

    const saidSentenceLikelihood = _.reduce(
      sentenceWordFreq,
      (accumulator: any, word_freq: number, word: string) => {
        const word_usage = _.get(user_word_distribution, word) ?? 1;
        const word_usage_likelihood = Math.pow(
          word_usage / user_message_count,
          word_freq
        );

        return Math.sqrt(accumulator * word_usage_likelihood);
      },
      likelihood
    );

    return {
      user_id: user_id,
      message_count: user_message_count,
      likelihood: saidSentenceLikelihood,
    };
  });

  const likelihoodRanking = _.orderBy(
    updatedLikelihood,
    ["likelihood"],
    ["desc"]
  );

  const first_place = likelihoodRanking[0].user_id;
  const username = await discordService
    .getUsernameById(first_place)
    .then((res: any) => res)

  return `${username}\n${JSON.stringify(likelihoodRanking, null, "\t")})`;
}

export const NaiveBayesCommand = {
  [COMMAND_NAME]: {
    create: createNaiveBayes,
    action: performNaiveBayes,
  },
};
