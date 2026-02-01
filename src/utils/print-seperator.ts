import chalk from "chalk";

export const printSeparator = (): void => {
  const columns = process.stdout.columns;

  console.log(chalk.gray("-".repeat(columns)));
};
