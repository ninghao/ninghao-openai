import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);
