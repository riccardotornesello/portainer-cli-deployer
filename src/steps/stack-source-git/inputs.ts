import { input, confirm, select } from "@inquirer/prompts"

import { RepoHost } from "../../types/stack-sources"
import { RepoHostDetails } from "../../utils/stack-sources"

export async function repoUrlInput() {
  return await input({
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
        /((http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?/
      if (!urlRegex.test(input)) {
        return "Invalid repository URL"
      }

      return true
    },
  })
}

export async function repoCredentialsRequiredInput() {
  return await confirm({
    message: "Does the repository require authentication?",
    default: false,
  })
}

export async function repoHostInput() {
  return (await select<string>({
    message: "Select the credentials method",
    choices: Object.entries(RepoHostDetails).map(([key, value]) => ({
      name: value,
      value: key,
    })),
  })) as RepoHost
}

export async function branchInput() {
  return await input({
    message: "Enter the branch name",
    default: "main",
    validate: (input) => {
      if (input === "") {
        return "Branch name cannot be empty"
      }

      return true
    },
  })
}

export async function composeFileNameInput() {
  return await input({
    message: "Enter the Compose file name",
    default: "docker-compose.yml",
  })
}
