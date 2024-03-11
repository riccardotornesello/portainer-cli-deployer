import { input } from "@inquirer/prompts"
import Table from "cli-table"

import multiline from "../inquiry/multiline"
import { DeploymentConfig, EnvironmentVariable } from "../types/deployment"
import { RepoConfig } from "../types/repo"

export async function askDeploymentConfig(
  repoConfig: RepoConfig
): Promise<DeploymentConfig> {
  const defaultStackName = `${repoConfig.repoUrl
    .split("/")
    .pop()
    ?.replace(".git", "")}-${repoConfig.branch}`

  const stackName = await input({
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

  const environmentVariables = await askEnvironmentVariables()

  return {
    stackName,
    environmentVariables,
  }
}

export async function askEnvironmentVariables(): Promise<
  EnvironmentVariable[]
> {
  const variablesInput = await multiline({
    message:
      "Enter environment variables as key=value pairs, one per line. Press Ctrl+D when done.",
  })

  const variables = variablesInput
    .filter((input) => input !== "")
    .map((row) => {
      const pieces = row.split(/=(.*)/s)
      return { name: pieces[0], value: pieces[1] || "" }
    })

  const table = new Table({
    head: ["Key", "Value"],
    rows: variables.map((v) => [v.name, v.value]),
  })

  console.log("Environment Variables:")
  console.log(table.toString())

  return variables
}
