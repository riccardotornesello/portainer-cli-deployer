import { password } from "@inquirer/prompts"

import { RepoHostInterface } from "../types/repo"
import { createGitlabRepoAccessToken } from "../api/gitlab"

export class GitlabRepoHost implements RepoHostInterface {
  repoUrl: string

  constructor(repoUrl: string) {
    this.repoUrl = repoUrl
  }

  async authenticate() {
    let gitlabRepoAccessToken: string

    await password({
      message: "Enter the GitLab personal access token",
      validate: async (input) => {
        if (input === "") {
          return "Personal access token cannot be empty"
        }

        gitlabRepoAccessToken = await createGitlabRepoAccessToken(
          this.repoUrl,
          input
        )

        if (gitlabRepoAccessToken === null) {
          return "Invalid personal access token"
        }

        // TODO: handle different errors

        return true
      },
    })

    return {
      username: "gitlab",
      password: gitlabRepoAccessToken!,
    }
  }
}
