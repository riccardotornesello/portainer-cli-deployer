import { password } from "@inquirer/prompts"

import { RepoHostInterface } from "../../types/git"
import { createGithubRepoAccessToken } from "../../api/github"

export class GithubRepoHost implements RepoHostInterface {
  repoUrl: string

  constructor(repoUrl: string) {
    this.repoUrl = repoUrl
  }

  async authenticate() {
    let githubRepoAccessToken: string

    await password({
      message: "Enter the GitHub personal access token",
      validate: async (input) => {
        if (input === "") {
          return "Personal access token cannot be empty"
        }

        githubRepoAccessToken = await createGithubRepoAccessToken(
          this.repoUrl,
          input
        )

        if (githubRepoAccessToken === null) {
          return "Invalid personal access token or insufficient permissions"
        }

        // TODO: handle different errors

        return true
      },
    })

    return {
      username: "github",
      password: githubRepoAccessToken!,
    }
  }
}
