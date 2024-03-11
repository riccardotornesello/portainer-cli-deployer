import axios from "axios";
import https from "https";
import { v4 as uuidv4 } from "uuid";

import { PortainerConfig, PortainerEnvironment } from "../types/portainer";
import { RepoConfig } from "../types/repo";
import { DeploymentConfig } from "../types/deployment";

export async function createPortainerStack(
  portainerConfig: PortainerConfig,
  environment: PortainerEnvironment,
  repoConfig: RepoConfig,
  deploymentConfig: DeploymentConfig
) {
  const stackData = {
    method: "repository",
    type: "standalone",
    Name: deploymentConfig.stackName,
    RepositoryURL: repoConfig.repoUrl,
    RepositoryReferenceName: `refs/heads/${repoConfig.branch}`,
    ComposeFile: repoConfig.composeFileName,
    AdditionalFiles: [],
    RepositoryAuthentication: Boolean(
      repoConfig.username && repoConfig.password
    ),
    RepositoryUsername: repoConfig.username,
    RepositoryPassword: repoConfig.password,
    Env: deploymentConfig.environmentVariables,
    TLSSkipVerify: false, // TODO
    AutoUpdate: {
      Interval: "",
      Webhook: uuidv4(),
      ForceUpdate: true,
      ForcePullImage: true,
    },
  };

  const res = await axios.post(
    `${portainerConfig.portainerUrl}/api/stacks/create/standalone/repository?endpointId=${environment.id}`,
    stackData,
    {
      headers: {
        "X-API-Key": portainerConfig.portainerAccessToken,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // TODO: validate HTTPS
    }
  );

  return res.data;
}

export async function getPortainerEnvironments(
  portainerConfig: PortainerConfig
) {
  let res;

  try {
    res = await axios.get(`${portainerConfig.portainerUrl}/api/endpoints`, {
      headers: {
        "X-API-Key": portainerConfig.portainerAccessToken,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // TODO: validate HTTPS
    });
  } catch (error) {
    // TODO: show error
    return null;
  }

  return res.data;
}

export async function checkPortainerConnection(portainerUrl: string) {
  let res;

  // TODO: improve checks

  try {
    res = await axios.get(portainerUrl, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // TODO: validate HTTPS
    });
  } catch (error) {
    return false;
  }

  return res.status === 200;
}

export async function getPortainerInfo(portainerConfig: PortainerConfig) {
  let res;

  try {
    res = await axios.get(`${portainerConfig.portainerUrl}/api/system/info`, {
      headers: {
        "X-API-Key": portainerConfig.portainerAccessToken,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // TODO: validate HTTPS
    });
  } catch (error) {
    // TODO: show error
    return null;
  }

  return res.data;
}
