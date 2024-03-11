import { askPortainerInstance } from "./configuration/portainer-instance"
import { askPortainerEnvironment } from "./configuration/portainer-environment"
import { askRepoConfig } from "./configuration/repo"
import { askDeploymentConfig } from "./configuration/deployment"

import { createPortainerStack } from "./api/portainer"

async function main() {
  const portainerConfig = await askPortainerInstance()
  const environment = await askPortainerEnvironment(portainerConfig)
  const repoConfig = await askRepoConfig()
  const deploymentConfig = await askDeploymentConfig(repoConfig)

  // TODO: ask confirmation

  const res = await createPortainerStack(
    portainerConfig,
    environment,
    repoConfig,
    deploymentConfig
  )
  console.log(res)
}

main()
