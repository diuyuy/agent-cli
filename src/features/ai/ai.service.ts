import { createAgent } from "./agents/my-agent";
import type { ModelProvider } from "./types/types";

export class AIService {
  private model: string;
  private static instance: AIService;

  private constructor() {
    this.model = "antrophic";
  }

  static getInstance() {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }

    return AIService.instance;
  }

  updateModel(newModel: ModelProvider) {
    this.model = newModel;
  }

  getModel() {
    return this.model;
  }

  generateResponse(query: string) {
    const agent = createAgent(this.model);
  }
}
