import { select } from "@inquirer/prompts"

import { StackSource } from "../../types/stack-sources"
import { StackSourceDetails } from "../../utils/stack-sources"

export async function askStackSource(): Promise<StackSource> {
  const buildMethod = (await select<any>({
    message: "Select a build method",
    choices: Object.entries(StackSourceDetails).map(([key, value]) => ({
      name: value,
      value: key,
    })),
  })) as StackSource

  return buildMethod
}
