import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { stepCountIs, ToolLoopAgent } from "ai";
import {
  ANTROPHIC_PROVIDER,
  GOOGLE_PROVIDER,
} from "../../../constants/model-provider";
import { AGENT_INSTRUCTION } from "../instructions/agent-instruction";
import { toolSet } from "../tools/tool-set";

export interface IAgentFactory {
  createAgent(modelName: string): ToolLoopAgent<never, typeof toolSet>;
}

export class AgentFactory implements IAgentFactory {
  createAgent(modelName: string): ToolLoopAgent<never, typeof toolSet> {
    const model = this.getModelProvider(modelName);

    return new ToolLoopAgent({
      model,
      instructions: AGENT_INSTRUCTION,
      stopWhen: stepCountIs(20),
      tools: toolSet,
    });
  }

  private getModelProvider(modelName: string) {
    if (ANTROPHIC_PROVIDER.includes(modelName)) {
      return anthropic(modelName);
    }

    if (GOOGLE_PROVIDER.includes(modelName)) {
      return google(modelName);
    }

    return openai(modelName);
  }
}
