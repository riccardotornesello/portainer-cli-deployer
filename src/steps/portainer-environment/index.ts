import { program } from "commander"

import { askPortainerEnvironment } from "./questions"

import { getPortainerEnvironments } from "../../api/portainer"
import { PortainerInstance, PortainerEnvironment } from "../../types/portainer"

const globalOptions = program.opts()

export default async function (
  portainerInstance: PortainerInstance
): Promise<PortainerEnvironment> {
  if (globalOptions.portainerEnvironment) {
    const availableEnvironments =
      await getPortainerEnvironments(portainerInstance)

    const chosenEnvironment = availableEnvironments.find(
      (env: any) => env.Id === globalOptions.portainerEnvironment
    )

    if (!chosenEnvironment) {
      throw new Error("Portainer environment not found")
    }

    return {
      id: chosenEnvironment.Id,
      name: chosenEnvironment.Name,
    }
  } else {
    const { id, name } = await askPortainerEnvironment(portainerInstance)

    return {
      id,
      name,
    }
  }
}
