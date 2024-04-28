import { input } from "@inquirer/prompts"

import multiline from "../../inquiry/multiline"

export async function stackNameInput(defaultStackName: string) {
  return await input({
    message: "Enter the stack name",
    default: defaultStackName,
    validate: (input) => {
      if (input === "") {
        return "Stack name cannot be empty"
      }

      if (!/^[a-zA-Z0-9-]+$/.test(input)) {
        return "Stack name can only contain letters, numbers and dashes"
      }

      return true
    },
  })
}

export async function environmentVariablesInput() {
  return await multiline({
    message:
      "Enter environment variables as key=value pairs, one per line. Press Ctrl+D when done.",
  })
}
