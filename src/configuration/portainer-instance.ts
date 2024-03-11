import { select, input, confirm } from "@inquirer/prompts"

import { getPortainerInstances, storePortainerInstances } from "../storage"
import { PortainerConfig } from "../types/portainer"
import { checkPortainerConnection, getPortainerInfo } from "../api/portainer"

export async function askPortainerInstance(): Promise<PortainerConfig> {
  const savedInstances = await getPortainerInstances()

  let { portainerUrl, portainerAccessToken } = await select({
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
  }

  return {
    portainerUrl,
    portainerAccessToken,
  }
}

async function askNewPortainerInstance(savedInstances: any) {
  let portainerUrl = await input({
    message: "Enter the Portainer URL",
    validate: async (input) => {
      if (input === "") {
        return "Portainer URL cannot be empty"
      }

      const urlRegex = /^(https?):\/\/([a-zA-Z0-9.-]+)(:\d{1,5})?(\/)?$/
      if (!urlRegex.test(input)) {
        return "Portainer URL is in an invalid format.\nIt should be in the format http(s)://hostname(:port)\nFor example: https://portainer.example.com:9000"
      }

      if (!(await checkPortainerConnection(input))) {
        return "Portainer URL is not reachable"
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

      if (
        !(await getPortainerInfo({
          portainerUrl,
          portainerAccessToken: input,
        }))
      ) {
        return "Portainer access token is not valid"
      }

      return true
    },
  })

  const newInstance = {
    portainerUrl,
    portainerAccessToken,
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
        return "The name is already in use"
      }

      return true
    },
  })

  if (portainerInstanceName === "") {
    return
  }

  const newInstances = otherInstances
  otherInstances[portainerInstanceName] = {
    portainerUrl: newInstance.portainerUrl,
    portainerAccessToken: newInstance.portainerAccessToken,
  }

  storePortainerInstances(newInstances)
}
