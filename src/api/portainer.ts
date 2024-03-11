import axios from "axios"
import https from "https"
import { v4 as uuidv4 } from "uuid"
import { program } from "commander"

import { PortainerConfig, PortainerEnvironment } from "../types/portainer"
import { RepoConfig } from "../types/repo"
import { DeploymentConfig } from "../types/deployment"

async function portainerApiCall(
  portainerConfig: PortainerConfig,
  method: string,
  url: string,
  data: any
) {
  const globalOptions = program.opts()

  return await axios.request({
    method,
    url,
    data,
    headers: {
      "X-API-Key": portainerConfig.portainerAccessToken,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: !globalOptions.insecurePortainer,
    }),
  })
}

export async function createPortainerStack(
  portainerConfig: PortainerConfig,
  environment: PortainerEnvironment,
  repoConfig: RepoConfig,
  deploymentConfig: DeploymentConfig
) {
  const globalOptions = program.opts()

  const stackData = {
    method: "repository",
    type: "standalone",
    Name: deploymentConfig.stackName,
    RepositoryURL: repoConfig.repoUrl,
    RepositoryReferenceName: `refs/heads/${repoConfig.branch}`,
    ComposeFile: repoConfig.composeFileName,
    AdditionalFiles: [],
    RepositoryAuthentication: repoConfig !== null,
    RepositoryUsername: repoConfig.credentials?.username,
    RepositoryPassword: repoConfig.credentials?.password,
    Env: deploymentConfig.environmentVariables,
    TLSSkipVerify: globalOptions.insecureRepo,
    AutoUpdate: {
      Interval: "",
      Webhook: uuidv4(),
      ForceUpdate: true,
      ForcePullImage: true,
    },
  }

  const res = await portainerApiCall(
    portainerConfig,
    "post",
    `${portainerConfig.portainerUrl}/api/stacks/create/standalone/repository?endpointId=${environment.id}`,
    stackData
  )

  return res.data
}

export async function getPortainerEnvironments(
  portainerConfig: PortainerConfig
) {
  try {
    const res = await portainerApiCall(
      portainerConfig,
      "get",
      `${portainerConfig.portainerUrl}/api/endpoints`,
      null
    )

    return res.data
  } catch (error) {
    // TODO: show error
    return null
  }
}

export async function checkPortainerConnection(portainerUrl: string) {
  let res

  // TODO: improve checks

  try {
    res = await axios.get(portainerUrl, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // TODO: validate HTTPS
    })
  } catch (error) {
    return false
  }

  return res.status === 200
}

export async function getPortainerInfo(portainerConfig: PortainerConfig) {
  try {
    const res = await portainerApiCall(
      portainerConfig,
      "get",
      `${portainerConfig.portainerUrl}/api/system/info`,
      null
    )

    return res.data
  } catch (error) {
    // TODO: show error
    return null
  }
}
