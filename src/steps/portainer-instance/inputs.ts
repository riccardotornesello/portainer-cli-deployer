import { select, input, confirm } from "@inquirer/prompts"

import { PortainerInstance } from "../../types/portainer"
import { urlRegex } from "../../utils/regex"

import {
  checkPortainerConnection,
  checkPortainerAuthentication,
} from "./validation"

export async function portainerInstanceInput(savedInstances: {
  [name: string]: PortainerInstance
}): Promise<PortainerInstance | null> {
  return await select({
    message: "Select a saved Portainer instance or enter a new one",
    choices: [
      {
        name: "New",
        value: null,
        description: "Connect to a new Portainer instance",
      },
      ...Object.keys(savedInstances).map((instanceName) => ({
        name: `${instanceName} - ${savedInstances[instanceName].portainerUrl}`,
        value: savedInstances[instanceName],
      })),
    ],
  })
}

export async function portainerInsecureInput() {
  return await await confirm({
    message: "Do you want to ignore certificate errors?",
    default: false,
  })
}

export async function portainerUrlInput(portainerInsecure: boolean) {
  return await input({
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
        portainerInsecure: portainerInsecure,
      })

      if (err) {
        return "Could not connect to the Portainer instance. Please check the URL and try again."
      }

      return true
    },
  })
}

export async function portainerAccessTokenInput(
  portainerUrl: string,
  portainerInsecure: boolean
) {
  return await input({
    message: "Enter the Portainer access token",
    validate: async (input) => {
      if (input === "") {
        return "Portainer access token cannot be empty"
      }

      const err = await checkPortainerAuthentication({
        portainerUrl,
        portainerAccessToken: input,
        portainerInsecure,
      })

      if (err) {
        return "Portainer access token is not valid"
      }

      return true
    },
  })
}

export async function savePortainerInput() {
  return await confirm({
    message: "Do you want to save the Portainer configuration for future use?",
    default: false,
  })
}

export async function portainerInstanceNameInput(
  otherInstancesNames: string[]
) {
  return await input({
    message: "Enter a name for the Portainer instance or leave empty to cancel",
    validate: (input) => {
      if (input === "") {
        return true
      }

      if (!/^[a-zA-Z0-9-]+$/.test(input)) {
        return "The name can only contain letters, numbers and dashes"
      }

      if (otherInstancesNames.includes(input)) {
        return "This name is already in use"
      }

      return true
    },
  })
}
