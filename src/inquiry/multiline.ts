import chalk from "chalk";
import {
  createPrompt,
  useState,
  useKeypress,
  isEnterKey,
  usePrefix,
  isBackspaceKey,
} from "@inquirer/core";

export default createPrompt<string[], { message: string }>((config, done) => {
  const [rows, setRows] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const prefix = usePrefix({});

  useKeypress((key, rl) => {
    if (isEnterKey(key)) {
      setRows([...rows, value]);
      setValue("");
    } else if (isBackspaceKey(key)) {
      setValue(value.slice(0, -1));
    } else if (key.name === "d" && key.ctrl) {
      done([...rows, value]);
    } else {
      setValue(rl.line);
    }
  });

  const message = chalk.bold(config.message);

  let output = `${prefix} ${message}\n`;
  if (rows.length > 0) {
    output += rows.map((row) => `${chalk.cyan(row)}`).join("\n") + "\n";
  }
  output += `${chalk.cyan(value)}`;

  return output;
});
