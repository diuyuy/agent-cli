import { input, select } from "@inquirer/prompts";
import type { ModelMessage } from "ai";
import chalk from "chalk";
import fg from "fast-glob";
import { mkdir } from "fs/promises";
import path from "path";
import { SESSION_PATH } from "../constants/app-constants";
import type { AIService } from "../features/ai/ai.service";
import { sanitizeFileName } from "../utils/sanitize-file-name";

export class SessionManager {
  private isLoaded: boolean;
  private sessionName: string | null;

  constructor(private readonly aiService: AIService) {
    this.isLoaded = false;
    this.sessionName = null;
    this.aiService = aiService;
  }

  // * Save Session
  async save(): Promise<void> {
    try {
      if (this.isLoaded) {
        await this.saveExistingSession();
      } else {
        await this.saveNewSession();
      }
      console.log("\n", chalk.blue("세션이 성공적으로 저장되었습니다."));
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        throw error;
      }
      console.error(chalk.red("세션 저장 중 오류가 발생했습니다:"), error);
      throw error;
    }
  }

  private setSession(sessionName: string) {
    this.isLoaded = true;
    this.sessionName = sessionName;
  }

  private async saveExistingSession(): Promise<void> {
    if (!this.sessionName) {
      throw new Error("Session Name does not exist.");
    }

    const filePath = path.join(process.cwd(), this.sessionName);

    await Bun.write(
      filePath,
      JSON.stringify(this.aiService.getMessages(), null, 2),
    );
  }

  private async saveNewSession(): Promise<void> {
    const fileName = await input({
      message: "파일 이름을 입력해주세요:",
      required: true,
      theme: {
        style: {
          answer: chalk.white,
        },
      },
    });

    const dir = path.join(process.cwd(), SESSION_PATH);
    await mkdir(dir, { recursive: true });

    const savedFileName = `${sanitizeFileName(fileName)}-${Date.now()}.json`;
    const filePath = path.join(dir, savedFileName);

    await Bun.write(
      filePath,
      JSON.stringify(this.aiService.getMessages(), null, 2),
    );

    this.setSession(savedFileName);
  }

  // * Load Session
  async load(): Promise<void> {
    try {
      const sessions = await this.getAvailableSessions();

      if (sessions.length === 0) {
        console.log(chalk.yellow("저장된 세션이 없습니다."));
        return;
      }

      const sessionFileName = await select({
        message: `로드할 세션을 선택해주세요. 현재 세션: ${this.sessionName ?? "None"}`,
        choices: sessions.map((s) => ({ value: s })),
      });

      await this.loadSessionFile(sessionFileName);
      console.log("\n", chalk.blue("세션이 성공적으로 로드되었습니다."));
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        throw error;
      }
      console.error(chalk.red("세션 로드 중 오류가 발생했습니다:"), error);
      throw error;
    }
  }

  private async getAvailableSessions(): Promise<string[]> {
    return await fg([`${SESSION_PATH}/*.json`], {
      cwd: process.cwd(),
      dot: true,
    });
  }

  private async loadSessionFile(sessionFileName: string): Promise<void> {
    const filePath = path.join(process.cwd(), sessionFileName);
    const buffer = Bun.file(filePath);
    const session = (await buffer.json()) as ModelMessage[];

    this.aiService.loadSession(session);
    this.setSession(sessionFileName);
  }

  // * Clear Session
  clearSession() {
    this.isLoaded = false;
    this.sessionName = null;
    this.aiService.clearMessages();
  }

  // * Update Model
  updateModel(modelName: string) {
    this.aiService.updateModel(modelName);
  }
}
