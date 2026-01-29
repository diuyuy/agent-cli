export const COMMAND_NAME = {
  MODEL: "/model",
  EDITOR: "/editor",
  CLEAR: "/clear",
  HELP: "/help",
} as const;

export const COMMANDS = [
  { value: COMMAND_NAME.MODEL, description: "Select AI model" },
  { value: COMMAND_NAME.EDITOR, description: "Open Editor" },
  { value: COMMAND_NAME.CLEAR, description: "Clear conversation" },
  { value: COMMAND_NAME.HELP, description: "Show help" },
];
