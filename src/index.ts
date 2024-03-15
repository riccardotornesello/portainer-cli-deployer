import { program } from "commander"
import { confirm } from "@inquirer/prompts"

import { askPortainerInstance } from "./configuration/portainer-instance"
import { askPortainerEnvironment } from "./configuration/portainer-environment"
import { askRepoConfig } from "./configuration/repo"
import { askDeploymentConfig } from "./configuration/deployment"
import { createPortainerStack } from "./api/portainer"

async function main() {
  program.option("--insecure-portainer").option("--insecure-repo")
  program.parse()

  const portainerConfig = await askPortainerInstance()
  const environment = await askPortainerEnvironment(portainerConfig)
  const repoConfig = await askRepoConfig()
  const deploymentConfig = await askDeploymentConfig(repoConfig)

  const confirmed = await confirm({
    message: "Do you want to deploy?",
    default: true,
  })
  if (!confirmed) {
    console.log("Aborted")
    return
  }

  // TODO: create gitlab access token only after confirmation

  const res = await createPortainerStack(
    portainerConfig,
    environment,
    repoConfig,
    deploymentConfig
  )
  console.log(res)
}

main()
