import Table from "cli-table"

import { DeploymentConfig, EnvironmentVariable } from "../../types/deployment"

import { stackNameInput, environmentVariablesInput } from "./inputs"

export async function askDeploymentConfig(
  defaultStackName: string
): Promise<DeploymentConfig> {
  const stackName = await stackNameInput(defaultStackName)
  const environmentVariables = await askEnvironmentVariables()

  return {
    stackName,
    environmentVariables,
  }
}

export async function askEnvironmentVariables(): Promise<
  EnvironmentVariable[]
> {
  const variablesInputVal = await environmentVariablesInput()

  const variables = variablesInputVal
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
