import type { ModelMessage } from "ai";
import chalk from "chalk";
import ora from "ora";
import type { IAgentFactory } from "./agents/agent-factory";
import type { ModelProvider } from "./types/types";

export class AIService {
  private model: string;
  private modelMessages: ModelMessage[];

  constructor(private readonly agentFactory: IAgentFactory) {
    this.model = "gemini-2.0-flash";
    this.modelMessages = [];
  }

  updateModel(newModel: ModelProvider) {
    this.model = newModel;
  }

  getModel() {
    return this.model;
  }

  getMessages() {
    return this.modelMessages;
  }

  clearMessages() {
    this.modelMessages = [];
  }

  loadSession(messages: ModelMessage[]) {
    this.modelMessages = messages;
  }

  async generateResponse(query: string) {
    const spinner = ora("Loading...");
    spinner.start();

    this.modelMessages.push({
      role: "user",
      content: query,
    });

    const agent = this.agentFactory.createAgent(this.model);
    const abortController = new AbortController();

    // stdin을 raw 모드로 설정하여 키 입력을 즉시 받을 수 있게 함
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let isCleanedUp = false;
    const cleanup = () => {
      if (isCleanedUp) return;

      process.stdin.removeListener("data", keyPressHandler);
      process.stdin.setRawMode(false);
      process.stdin.pause();

      isCleanedUp = true;
    };

    const keyPressHandler = (key: string) => {
      // ESC 키 코드: \x1b 또는 \u001b
      if (key === "\x1b") {
        console.log("\n\n⚠️  Stream aborted by user");
        abortController.abort();
        cleanup();
      }
      // Ctrl+C 처리
      if (key === "\x03") {
        abortController.abort();
        process.exit();
      }
    };

    process.stdin.on("data", keyPressHandler);

    try {
      const result = await agent.stream({
        messages: this.modelMessages,
        abortSignal: abortController.signal,
      });

      // 스트림 처리
      let isFirstChunk = true;
      for await (const chunk of result.textStream) {
        if (isFirstChunk) {
          spinner.stop();
          isFirstChunk = false;
          console.log(chalk.gray("\nAI Response\n" + "-".repeat(100)), "\n");
        }

        process.stdout.write(chunk);
      }

      console.log("\n", chalk.gray("-").repeat(100), "\n");

      const generatedMessages = (await result.response).messages;

      this.modelMessages.push(...generatedMessages);
    } catch (error) {
      spinner.stop();
      this.modelMessages.pop();

      if (error instanceof Error && error.name === "AbortError") {
        console.log("Stream was cancelled");
      } else {
        throw error;
      }
    } finally {
      cleanup();
    }
  }
}
