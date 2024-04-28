import { program } from "commander"

import { urlRegex } from "../../utils/regex"
import { PortainerConfig } from "../../types/portainer"

import { getPortainerInstances } from "./storage"
import { askPortainerInstance } from "./questions"
import {
  checkPortainerConnection,
  checkPortainerAuthentication,
} from "./validation"

const globalOptions = program.opts()

export default async function (): Promise<PortainerConfig> {
  if (globalOptions.portainerInstance) {
    return await getInstanceByName()
  } else if (globalOptions.portainerUrl) {
    return await getInstanceByUrl()
  } else {
    if (globalOptions.portainerAccessToken) {
      throw new Error(
        "Portainer access token is not required when not using a URL"
      )
    }

    return await askPortainerInstance()
  }
}

async function getInstanceByName() {
  if (globalOptions.portainerAccessToken) {
    throw new Error(
      "Portainer access token is not required when using a saved instance"
    )
  }

  if (globalOptions.portainerUrl) {
    throw new Error("Portainer URL is not required when using a saved instance")
  }

  const savedInstances = await getPortainerInstances()

  if (!savedInstances[globalOptions.portainerInstance]) {
    throw new Error("Portainer instance not found")
  }

  const savedInstance = savedInstances[globalOptions.portainerInstance]

  const err = await checkPortainerAuthentication(savedInstance)
  if (err) {
    throw new Error(err)
  }

  return savedInstance
}

async function getInstanceByUrl() {
  if (!globalOptions.portainerAccessToken) {
    throw new Error("Portainer access token is required when using a URL")
  }

  if (!urlRegex.test(globalOptions.portainerUrl)) {
    throw new Error("Invalid Portainer URL format")
  }

  let err = await checkPortainerConnection({
    portainerUrl: globalOptions.portainerUrl,
    portainerAccessToken: "",
    portainerInsecure: globalOptions.portainerInsecure ?? false,
  })
  if (err) {
    throw new Error(err)
  }

  err = await checkPortainerAuthentication({
    portainerUrl: globalOptions.portainerUrl,
    portainerAccessToken: globalOptions.portainerAccessToken,
    portainerInsecure: globalOptions.portainerInsecure ?? false,
  })

  if (err) {
    throw new Error(err)
  }

  return {
    portainerUrl: globalOptions.portainerInstance,
    portainerAccessToken: globalOptions.portainerAccessToken,
    portainerInsecure: globalOptions.portainerInsecure ?? false,
  }
}
