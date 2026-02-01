export const COMMAND_NAME = {
  MODEL: "/model",
  EDITOR: "/editor",
  SAVE: "/save",
  LOAD_SESSION: "/load_session",
  COPY: "/copy",
  CLEAR: "/clear",
  HELP: "/help",
};

export const COMMANDS = [
  { value: COMMAND_NAME.MODEL, description: "Select AI model" },
  { value: COMMAND_NAME.EDITOR, description: "Open Editor" },
  { value: COMMAND_NAME.SAVE, description: "Save current sessions" },
  { value: COMMAND_NAME.LOAD_SESSION, description: "Load session" },
  { value: COMMAND_NAME.COPY, description: "Copy file" },
  { value: COMMAND_NAME.CLEAR, description: "Clear conversation" },
  { value: COMMAND_NAME.HELP, description: "Show help" },
];
