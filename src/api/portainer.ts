import axios from "axios"
import https from "https"
import { v4 as uuidv4 } from "uuid"

import { PortainerConfig, PortainerEnvironment } from "../types/portainer"
import { RepoConfig } from "../types/git"
import { DeploymentConfig } from "../types/deployment"

async function portainerApiCall(
  portainerConfig: PortainerConfig,
  method: string,
  url: string,
  data: any = null
) {
  return await axios.request({
    method,
    url,
    data,
    baseURL: portainerConfig.portainerUrl,
    headers: {
      "X-API-Key": portainerConfig.portainerAccessToken,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: !portainerConfig.portainerInsecure,
    }),
  })
}

export async function getPortainerInstanceStatus(
  portainerConfig: PortainerConfig
) {
  const res = await portainerApiCall(
    portainerConfig,
    "get",
    "/api/system/status"
  )

  if (res.status !== 200) {
    throw new Error("Portainer instance is not reachable")
  }

  return res.data
}

export async function getPortainerInstanceInfo(
  portainerConfig: PortainerConfig
) {
  const res = await portainerApiCall(portainerConfig, "get", "/api/system/info")

  if (res.status === 401) {
    throw new Error("Unauthorized")
  }

  if (res.status !== 200) {
    throw new Error("Portainer instance is not reachable")
  }

  return res.data
}

export async function getPortainerEnvironments(
  portainerConfig: PortainerConfig
) {
  const res = await portainerApiCall(portainerConfig, "get", "/api/endpoints")

  return res.data
}

export async function createPortainerStack(
  portainerConfig: PortainerConfig,
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
        TLSSkipVerify: true, // TODO: insecureRepo in options
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
    portainerConfig,
    "post",
    `/api/stacks/create/standalone/repository?endpointId=${environment.id}`,
    stackData
  )

  return res.data
}
