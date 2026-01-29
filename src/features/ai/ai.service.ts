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

  updateModel(newModel: string) {
    this.model = newModel;
  }

  getModel() {
    return this.model;
  }
}
