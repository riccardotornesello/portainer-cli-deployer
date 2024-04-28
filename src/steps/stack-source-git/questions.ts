import { RepoConfig, RepoCredentials, RepoHostInterface } from "../../types/git"
import { RepoHost } from "../../types/stack-sources"
import { GitlabRepoHost } from "../../integrations/repo/gitlab"
import { OtherRepoHost } from "../../integrations/repo/other"

import {
  repoUrlInput,
  repoCredentialsRequiredInput,
  repoHostInput,
  branchInput,
  composeFileNameInput,
} from "./inputs"

export async function askRepoConfig(): Promise<RepoConfig> {
  const repoUrl = await repoUrlInput()
  const credentials = await askRepoCredentials(repoUrl)
  const branch = await branchInput()
  const composeFileName = await composeFileNameInput()

  // TODO: check repo auth, branch and file

  return {
    repoUrl,
    branch,
    composeFileName,
    credentials,
  }
}

async function askRepoCredentials(
  repoUrl: string
): Promise<RepoCredentials | null> {
  const requireCredentials = await repoCredentialsRequiredInput()
  if (!requireCredentials) {
    return null
  }

  const repoHostInputVal = await repoHostInput()
  let repoHost: RepoHostInterface

  switch (repoHostInputVal) {
    case RepoHost.GITLAB:
      repoHost = new GitlabRepoHost(repoUrl)
      break
    case RepoHost.OTHER:
      repoHost = new OtherRepoHost()
      break
    default:
      throw new Error("Invalid repo host")
  }

  // TODO: generate auth tokens only after confirmation

  const credentials = await repoHost.authenticate()

  return credentials
}
