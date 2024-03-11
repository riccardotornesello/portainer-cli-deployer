import { input, confirm, select } from "@inquirer/prompts"

import { RepoConfig, RepoCredentials, RepoHostInterface } from "../types/repo"
import { GitlabRepoHost, OtherRepoHost, RepoHost } from "../repo"

export async function askRepoConfig(): Promise<RepoConfig> {
  const repoUrl = await input({
    message: "Enter the repository URL",
    validate: (input) => {
      if (input === "") {
        return "Repository URL cannot be empty"
      }

      // Return an error if the url starts with git
      if (input.startsWith("git")) {
        return "Only HTTP and HTTPS protocols are allowed"
      }

      const urlRegex =
        /((ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?/
      if (!urlRegex.test(input)) {
        return "Invalid repository URL"
      }

      return true
    },
  })

  const branch = await input({
    message: "Enter the branch name",
    default: "main",
    validate: (input) => {
      if (input === "") {
        return "Branch name cannot be empty"
      }

      return true
    },
  })

  const composeFileName = await input({
    message: "Enter the Compose file name",
    default: "docker-compose.yml",
  })

  // TODO: check repo auth, branch and file

  const credentials = await askRepoCredentials(repoUrl)

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
  const requireCredentials = await confirm({
    message: "Does the repository require authentication?",
    default: false,
  })

  if (!requireCredentials) {
    return null
  }

  const repoHostInput = await select({
    message: "Select the credentials method",
    choices: Object.entries(RepoHost).map(([key, value]) => ({
      name: value,
      value: key,
    })),
  })

  let repoHost: RepoHostInterface

  switch (repoHostInput) {
    case RepoHost.GITLAB:
      repoHost = new GitlabRepoHost(repoUrl)
      break
    case RepoHost.OTHER:
      repoHost = new OtherRepoHost()
      break
    default:
      throw new Error("Invalid repo host")
  }

  const credentials = await repoHost.authenticate()

  return credentials
}
