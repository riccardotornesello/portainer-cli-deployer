import path from "path"
import os from "os"

// TODO: allow custom configuration path

export const configurationPath = path.join(
  os.homedir(),
  ".portainer-cli-deployer"
)
