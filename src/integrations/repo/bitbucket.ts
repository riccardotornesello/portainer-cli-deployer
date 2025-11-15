import { password } from "@inquirer/prompts"

import { RepoHostInterface } from "../../types/git"
import { createBitbucketRepoAccessToken } from "../../api/bitbucket"

export class BitbucketRepoHost implements RepoHostInterface {
  repoUrl: string

  constructor(repoUrl: string) {
    this.repoUrl = repoUrl
  }

  async authenticate() {
    let bitbucketRepoAccessToken: string

    await password({
      message: "Enter the Bitbucket app password",
      validate: async (input) => {
        if (input === "") {
          return "App password cannot be empty"
        }

        bitbucketRepoAccessToken = await createBitbucketRepoAccessToken(
          this.repoUrl,
          input
        )

        if (bitbucketRepoAccessToken === null) {
          return "Invalid app password or insufficient permissions"
        }

        // TODO: handle different errors

        return true
      },
    })

    return {
      username: "bitbucket",
      password: bitbucketRepoAccessToken!,
    }
  }
}
