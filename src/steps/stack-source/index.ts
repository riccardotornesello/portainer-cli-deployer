import { program } from "commander"

import { StackSource } from "../../types/stack-sources"

import { askStackSource } from "./questions"

const inputOptions = program.opts()

export default async function (): Promise<StackSource> {
  let stackSource: StackSource
  if (inputOptions.stackSource) {
    if (!Object.values(StackSource).includes(inputOptions.stackSource)) {
      throw new Error(`Invalid stack source: ${inputOptions.stackSource}`)
    }
    stackSource = inputOptions.stackSource as StackSource
  } else {
    stackSource = await askStackSource()
  }

  return stackSource
}
