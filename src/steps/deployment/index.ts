// TODO: allow configuration using options

import { askDeploymentConfig } from "./questions"

export default async function (defaultStackName: string) {
  return await askDeploymentConfig(defaultStackName)
}
