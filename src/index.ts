#! /usr/bin/env node

import { program } from "commander"
import { confirm } from "@inquirer/prompts"

import { createPortainerStack } from "./api/portainer"

import portainerInstanceStep from "./steps/portainer-instance"
import portainerEnvironmentStep from "./steps/portainer-environment"
import stackSourceStep from "./steps/stack-source"
import gitStep from "./steps/stack-source-git"
import deploymentStep from "./steps/deployment"

import { StackSource } from "./types/stack-sources"

async function main() {
  program
    .option("--portainer-insecure")
    .option("--portainer-instance")
    .option("--portainer-url")
    .option("--portainer-access-token")
  program.parse()

  const portainerInstance = await portainerInstanceStep()
  const portainerEnvironment = await portainerEnvironmentStep(portainerInstance)
  const stackSource = await stackSourceStep()

  let gitConfig
  let defaultStackName

  if (stackSource === StackSource.GIT) {
    gitConfig = await gitStep()

    defaultStackName = `${gitConfig.repoUrl
      .split("/")
      .pop()
      ?.replace(".git", "")}-${gitConfig.branch}`
  } else {
    throw new Error("Invalid stack source")
  }

  const deploymentConfig = await deploymentStep(defaultStackName)

  const confirmed = await confirm({
    message: "Do you want to deploy?",
    default: true,
  })
  if (!confirmed) {
    console.log("Aborted")
    return
  }

  const res = await createPortainerStack(
    portainerInstance,
    portainerEnvironment,
    deploymentConfig,
    gitConfig
  )
  console.log(res)
}

main()
