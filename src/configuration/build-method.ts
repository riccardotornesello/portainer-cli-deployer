import { select } from "@inquirer/prompts"

export async function askBuildMethod(): Promise<string> {
  // TODO: allow other methods

  const buildMethod = await select<any>({
    message: "Select a build method",
    choices: [
      {
        name: "git",
        value: "git",
      },
    ],
  })

  return buildMethod
}
