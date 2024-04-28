import path from "path"
import fs from "fs"

import { configurationPath } from "../../utils/storage"
import { PortainerConfig } from "../../types/portainer"

const instancesFilePath = path.join(configurationPath, "credentials.json")

export async function getPortainerInstances() {
  if (!fs.existsSync(instancesFilePath)) {
    return {}
  }

  return JSON.parse(fs.readFileSync(instancesFilePath, "utf8"))
}

export async function storePortainerInstance(
  name: string,
  portainerInstance: PortainerConfig
) {
  fs.mkdirSync(configurationPath, {
    recursive: true,
  })

  const instances = await getPortainerInstances()
  instances[name] = portainerInstance

  fs.writeFileSync(instancesFilePath, JSON.stringify(instances, null, 2))
}
