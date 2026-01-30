import { stepCountIs, ToolLoopAgent } from "ai";
import { getModelProvider } from "../../../common/utils/get-model-provider";
import { AGENT_INSTRUCTION } from "../instructions/agent-instruction";
import { deepSearch } from "../tools/deep-search";

export const createAgent = (modelName: string) => {
  const model = getModelProvider(modelName);

  return new ToolLoopAgent({
    model,
    instructions: AGENT_INSTRUCTION,
    stopWhen: stepCountIs(20),
    tools: {
      deepSearch,
    },
  });
};
