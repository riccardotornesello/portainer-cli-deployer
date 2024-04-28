import { select } from "@inquirer/prompts"

import { getPortainerEnvironments } from "../../api/portainer"
import { PortainerConfig, PortainerEnvironment } from "../../types/portainer"

export async function askPortainerEnvironment(
  portainerConfig: PortainerConfig
): Promise<PortainerEnvironment> {
  const endpoints = await getPortainerEnvironments(portainerConfig)

  if (!endpoints) {
    throw new Error("Cannot get Portainer environments")
  }

  const endpoint = await select<any>({
    message: "Select a Portainer environment",
    choices: endpoints.map((endpoint: any) => ({
      name: endpoint.Name,
      value: endpoint,
    })),
  })

  return {
    id: endpoint.Id,
    name: endpoint.Name,
  }
}
