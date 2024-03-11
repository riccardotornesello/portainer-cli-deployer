import { input, password } from "@inquirer/prompts"

import { RepoHostInterface } from "../types/repo"

export class OtherRepoHost implements RepoHostInterface {
  async authenticate() {
    const username = await input({
      message: "Enter the username",
      validate: (input) => {
        if (input === "") {
          return "Username cannot be empty"
        }

        return true
      },
    })

    const passwordValue = await password({
      message: "Enter the password",
      validate: (input) => {
        if (input === "") {
          return "Password cannot be empty"
        }

        return true
      },
    })

    return {
      username,
      password: passwordValue,
    }
  }
}
