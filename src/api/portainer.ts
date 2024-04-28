import axios from "axios"
import https from "https"
import { v4 as uuidv4 } from "uuid"

import { PortainerInstance, PortainerEnvironment } from "../types/portainer"
import { RepoConfig } from "../types/git"
import { DeploymentConfig } from "../types/deployment"

async function portainerApiCall(
  portainerInstance: PortainerInstance,
  method: string,
  url: string,
  data: any = null
) {
  return await axios.request({
    method,
    url,
    data,
    baseURL: portainerInstance.portainerUrl,
    headers: {
      "X-API-Key": portainerInstance.portainerAccessToken,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: !portainerInstance.portainerInsecure,
    }),
  })
}

export async function getPortainerInstanceStatus(
  portainerInstance: PortainerInstance
) {
  const res = await portainerApiCall(
    portainerInstance,
    "get",
    "/api/system/status"
  )

  if (res.status !== 200) {
    throw new Error("Portainer instance is not reachable")
  }

  return res.data
}

export async function getPortainerInstanceInfo(
  portainerInstance: PortainerInstance
) {
  const res = await portainerApiCall(
    portainerInstance,
    "get",
    "/api/system/info"
  )

  if (res.status === 401) {
    throw new Error("Unauthorized")
  }

  if (res.status !== 200) {
    throw new Error("Portainer instance is not reachable")
  }

  return res.data
}

export async function getPortainerEnvironments(
  portainerInstance: PortainerInstance
) {
  const res = await portainerApiCall(portainerInstance, "get", "/api/endpoints")

  return res.data
}

export async function createPortainerStack(
  portainerInstance: PortainerInstance,
  environment: PortainerEnvironment,
  deploymentConfig: DeploymentConfig,
  repoConfig?: RepoConfig
) {
  const repoOptions = repoConfig
    ? {
        RepositoryURL: repoConfig.repoUrl,
        ComposeFile: repoConfig.composeFileName,
        RepositoryReferenceName: `refs/heads/${repoConfig.branch}`,
        RepositoryAuthentication: repoConfig !== null,
        RepositoryUsername: repoConfig.credentials?.username,
        RepositoryPassword: repoConfig.credentials?.password,
        TLSSkipVerify: repoConfig.insecureRepoUrl,
      }
    : {}

  const stackData = {
    method: "repository",
    type: "standalone",
    Name: deploymentConfig.stackName,
    AdditionalFiles: [],
    Env: deploymentConfig.environmentVariables,
    AutoUpdate: {
      Interval: "",
      Webhook: uuidv4(),
      ForceUpdate: true,
      ForcePullImage: true,
    },
    ...repoOptions,
  }

  const res = await portainerApiCall(
    portainerInstance,
    "post",
    `/api/stacks/create/standalone/repository?endpointId=${environment.id}`,
    stackData
  )

  return res.data
}
