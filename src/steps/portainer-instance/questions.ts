import { select, input, confirm } from "@inquirer/prompts"

import { getPortainerInstances, storePortainerInstance } from "./storage"
import { PortainerConfig } from "../../types/portainer"
import {
  checkPortainerConnection,
  checkPortainerAuthentication,
} from "./validation"
import { urlRegex } from "../../utils/regex"

export async function askPortainerInstance(): Promise<PortainerConfig> {
  const savedInstances = await getPortainerInstances()

  let { portainerUrl, portainerAccessToken, portainerInsecure } = await select({
    message: "Select a saved Portainer instance or enter a new one",
    choices: [
      {
        name: "New",
        value: { portainerUrl: null, portainerAccessToken: null },
        description: "Connect to a new Portainer instance",
      },
      ...Object.keys(savedInstances).map((instanceName) => ({
        name: `${instanceName} - ${savedInstances[instanceName].portainerUrl}`,
        value: savedInstances[instanceName],
      })),
    ],
  })

  if (portainerUrl === null) {
    const newPortainerConfig = await askNewPortainerInstance(savedInstances)
    portainerUrl = newPortainerConfig.portainerUrl
    portainerAccessToken = newPortainerConfig.portainerAccessToken
    portainerInsecure = newPortainerConfig.portainerInsecure
  } else {
    let err = await checkPortainerConnection({
      portainerUrl,
      portainerAccessToken,
      portainerInsecure,
    })
    if (err) {
      throw new Error("Could not connect to the Portainer instance")
    }

    err = await checkPortainerAuthentication({
      portainerUrl,
      portainerAccessToken,
      portainerInsecure,
    })
    if (err) {
      throw new Error("Portainer authentication failed")
    }
  }

  return {
    portainerUrl,
    portainerAccessToken,
    portainerInsecure,
  }
}

async function askNewPortainerInstance(savedInstances: any) {
  const insecure = await confirm({
    message: "Do you want to ignore certificate errors?",
    default: false,
  })

  let portainerUrl = await input({
    message: "Enter the Portainer URL",
    validate: async (input) => {
      if (input === "") {
        return "Portainer URL cannot be empty"
      }

      if (!urlRegex.test(input)) {
        return "Portainer URL is in an invalid format.\nIt should be in the format http(s)://hostname(:port)\nFor example: https://portainer.example.com:9000"
      }

      const err = await checkPortainerConnection({
        portainerUrl: input,
        portainerAccessToken: "",
        portainerInsecure: insecure,
      })

      if (err) {
        return "Could not connect to the Portainer instance. Please check the URL and try again."
      }

      return true
    },
  })

  // Remove trailing slash if present
  if (portainerUrl.endsWith("/")) {
    portainerUrl = portainerUrl.slice(0, -1)
  }

  const portainerAccessToken = await input({
    message: "Enter the Portainer access token",
    validate: async (input) => {
      if (input === "") {
        return "Portainer access token cannot be empty"
      }

      const err = await checkPortainerAuthentication({
        portainerUrl,
        portainerAccessToken: input,
        portainerInsecure: insecure,
      })

      if (err) {
        return "Portainer access token is not valid"
      }

      return true
    },
  })

  const newInstance = {
    portainerUrl,
    portainerAccessToken,
    portainerInsecure: insecure,
  }

  await askSavePortainerInstance(savedInstances, newInstance)

  return newInstance
}

async function askSavePortainerInstance(
  otherInstances: any,
  newInstance: PortainerConfig
) {
  const shouldSavePortainerConfig = await confirm({
    message: "Do you want to save the Portainer configuration for future use?",
    default: false,
  })

  if (!shouldSavePortainerConfig) {
    return
  }

  const portainerInstanceName = await input({
    message: "Enter a name for the Portainer instance or leave empty to cancel",
    validate: (input) => {
      if (input === "") {
        return true
      }

      if (!/^[a-zA-Z0-9-]+$/.test(input)) {
        return "The name can only contain letters, numbers and dashes"
      }

      if (Object.keys(otherInstances).includes(input)) {
        return "This name is already in use"
      }

      return true
    },
  })

  if (portainerInstanceName === "") {
    return
  }

  await storePortainerInstance(portainerInstanceName, newInstance)
}
