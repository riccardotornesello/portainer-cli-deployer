import path from "path";
import os from "os";
import fs from "fs";

const configurationPath = path.join(os.homedir(), ".portainer-git-deployer");
const instancesFilePath = path.join(configurationPath, "credentials.json");

export async function getPortainerInstances() {
  if (!fs.existsSync(instancesFilePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(instancesFilePath, "utf8"));
}

export async function storePortainerInstances(instances: any) {
  fs.mkdirSync(configurationPath, {
    recursive: true,
  });

  fs.writeFileSync(instancesFilePath, JSON.stringify(instances, null, 2));
}
