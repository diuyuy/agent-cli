import {
  createPrompt,
  isDownKey,
  isEnterKey,
  isTabKey,
  isUpKey,
  makeTheme,
  useKeypress,
  usePrefix,
  useState,
  type Status,
  type Theme,
} from "@inquirer/core";

import { styleText } from "node:util";

import type { PartialDeep } from "@inquirer/type";
import { COMMANDS } from "../constants/commands";

type Command = {
  value: string;
  description?: string;
};

type PromptConfig = {
  message: string;
  commands?: Command[];
  theme?: PartialDeep<Theme>;
};

const userInput = createPrompt<string, PromptConfig>((config, done) => {
  const theme = makeTheme(config.theme);

  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prefix = usePrefix({ status, theme });

  const commands = (config.commands ?? COMMANDS).filter((cmd) =>
    cmd.value.toLowerCase().startsWith(value.toLowerCase()),
  );

  useKeypress((key, rl) => {
    if (isEnterKey(key)) {
      if (showCommands) {
        const selected = commands[selectedIndex];
        // 명령어 선택 모드
        setValue(selected?.value ?? "");
        setShowCommands(false);
        setSelectedIndex(0);
        rl.line = selected?.value ?? "";

        setStatus("done");
        done(selected?.value ?? "");
      } else {
        setStatus("done");
        done(value);
      }
    } else if (key.name === "escape") {
      if (showCommands) {
        setShowCommands(false);
        setSelectedIndex(0);
      }
    } else if (showCommands) {
      if (isUpKey(key)) {
        const index =
          selectedIndex > 0 ? selectedIndex - 1 : commands.length - 1;

        setSelectedIndex(index);
      } else if (isDownKey(key)) {
        const index = selectedIndex < commands.length ? selectedIndex + 1 : 0;

        setSelectedIndex(index);
      } else if (isTabKey(key)) {
        const selected = commands[selectedIndex];

        setValue(selected?.value ?? "");
        setShowCommands(false);
        setSelectedIndex(0);
        rl.line = selected?.value ?? "";
      } else {
        setValue(rl.line);
      }
    } else {
      const newValue = rl.line;
      setValue(newValue);

      if (newValue === "/" && newValue.length < 6) {
        setShowCommands(true);
        setSelectedIndex(0);
      } else {
        setShowCommands(false);
      }
    }
  });

  const renderCommands = () => {
    if (!showCommands) return "";

    if (commands.length === 0) {
      return "\n" + styleText("dim", "  No matching commands");
    }

    const items = commands.map((cmd, idx) => {
      const isActive = idx === selectedIndex;
      const cursor = isActive ? styleText("blue", "❯") : " ";
      const cmdValue = isActive ? styleText("blue", cmd.value) : cmd.value;
      const description = cmd.description
        ? styleText("dim", ` - ${cmd.description}`)
        : "";

      return `${cursor} ${cmdValue}${description}`;
    });

    return "\n" + items.join("\n");
  };

  // 메시지 렌더링
  let formattedValue = value;

  const message = styleText("bold", config.message);
  const helpText = showCommands
    ? styleText("dim", "\n(↑↓ to navigate, Enter to select, Esc to cancel)")
    : "";

  return `${prefix} ${message} ${formattedValue}${renderCommands()}${helpText}`;
});

export default userInput;
