import type { ModelMessage } from "ai";
import chalk from "chalk";
import ora from "ora";
import { printSeparator } from "../../utils/print-seperator";
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
        abortController.abort();
      }

      // Ctrl+C 처리
      if (key === "\x03") {
        abortController.abort();
      }
    };

    process.stdin.on("data", keyPressHandler);
    let isFirstChunk = true;

    try {
      const result = await agent.stream({
        messages: this.modelMessages,
        abortSignal: abortController.signal,
        onStepFinish: ({ toolCalls, toolResults }) => {
          spinner.stop();
          isFirstChunk = false;
          if (toolCalls.length > 0) {
            console.log(JSON.stringify(toolCalls, null, 2));
          }
          if (toolResults.length > 0) {
            console.log(JSON.stringify(toolResults, null, 2));
          }
        },
      });

      // 스트림 처리

      for await (const chunk of result.textStream) {
        if (isFirstChunk) {
          spinner.stop();
          isFirstChunk = false;
          console.log(chalk.gray("\nAI Response"));
          printSeparator();
        }

        process.stdout.write(chunk);
      }
      console.log("");
      printSeparator();

      const generatedMessages = (await result.response).messages;

      this.modelMessages.push(...generatedMessages);
    } catch (error) {
      spinner.stop();
      this.modelMessages.pop();

      throw error;
    } finally {
      cleanup();
    }
  }
}
