import { PortainerInstance } from "../../types/portainer"

import { getPortainerInstances, storePortainerInstance } from "./storage"
import {
  checkPortainerConnection,
  checkPortainerAuthentication,
} from "./validation"
import {
  portainerInstanceInput,
  portainerInsecureInput,
  portainerUrlInput,
  portainerAccessTokenInput,
  savePortainerInput,
  portainerInstanceNameInput,
} from "./inputs"

export async function askPortainerInstance(): Promise<PortainerInstance> {
  const savedInstances = await getPortainerInstances()

  let portainerInstance = await portainerInstanceInput(savedInstances)

  if (portainerInstance === null) {
    const newPortainerConfig = await askNewPortainerInstance(savedInstances)
    portainerInstance = {
      portainerUrl: newPortainerConfig.portainerUrl,
      portainerAccessToken: newPortainerConfig.portainerAccessToken,
      portainerInsecure: newPortainerConfig.portainerInsecure,
    }
  } else {
    let err = await checkPortainerConnection(portainerInstance)
    if (err) {
      throw new Error("Could not connect to the Portainer instance")
    }

    err = await checkPortainerAuthentication(portainerInstance)
    if (err) {
      throw new Error("Portainer authentication failed")
    }
  }

  return portainerInstance
}

async function askNewPortainerInstance(savedInstances: any) {
  const portainerInsecure = await portainerInsecureInput()
  let portainerUrl = await portainerUrlInput(portainerInsecure)

  // Remove trailing slash if present
  if (portainerUrl.endsWith("/")) {
    portainerUrl = portainerUrl.slice(0, -1)
  }

  const portainerAccessToken = await portainerAccessTokenInput(
    portainerUrl,
    portainerInsecure
  )

  const newInstance = {
    portainerUrl,
    portainerAccessToken,
    portainerInsecure,
  }

  await askSavePortainerInstance(savedInstances, newInstance)

  return newInstance
}

async function askSavePortainerInstance(
  otherInstances: any,
  newInstance: PortainerInstance
) {
  const shouldSavePortainerConfig = await savePortainerInput()
  if (!shouldSavePortainerConfig) {
    return
  }

  const portainerInstanceName = await portainerInstanceNameInput(
    Object.keys(otherInstances)
  )
  if (portainerInstanceName === "") {
    return
  }

  await storePortainerInstance(portainerInstanceName, newInstance)
}
