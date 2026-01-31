import { AgentFactory } from "./agents/agent-factory";
import { AIService } from "./ai.service";

export const createAIService = () => {
  const agentFactory = new AgentFactory();

  const aiService = new AIService(agentFactory);

  return aiService;
};
