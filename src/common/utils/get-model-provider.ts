import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {
  ANTROPHIC_PROVIDER,
  GOOGLE_PROVIDER,
} from "../constants/model-provider";

export const getModelProvider = (modelName: string) => {
  if (ANTROPHIC_PROVIDER.includes(modelName)) {
    return anthropic(modelName);
  }

  if (GOOGLE_PROVIDER.includes(modelName)) {
    return google(modelName);
  }

  return openai(modelName);
};
