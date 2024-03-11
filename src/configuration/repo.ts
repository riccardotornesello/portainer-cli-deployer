import { input, confirm, password, select } from "@inquirer/prompts";

import { RepoConfig } from "../types/repo";
import { createGitlabRepoAccessToken } from "../api/gitlab";

export async function askRepoConfig(): Promise<RepoConfig> {
  const repoUrl = await input({
    message: "Enter the repository URL",
    validate: (input) => {
      if (input === "") {
        return "Repository URL cannot be empty";
      }

      // Return an error if the url starts with git
      if (input.startsWith("git")) {
        return "Only HTTP and HTTPS protocols are allowed";
      }

      const urlRegex =
        /((ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?/;
      if (!urlRegex.test(input)) {
        return "Invalid repository URL";
      }

      return true;
    },
  });

  const branch = await input({
    message: "Enter the branch name",
    default: "main",
    validate: (input) => {
      if (input === "") {
        return "Branch name cannot be empty";
      }

      return true;
    },
  });

  const composeFileName = await input({
    message: "Enter the Compose file name",
    default: "docker-compose.yml",
  });

  // TODO: check repo auth, branch and file

  const { username, password } = await askRepoCredentials(repoUrl);

  return {
    repoUrl,
    branch,
    composeFileName,
    username,
    password,
  };
}

async function askRepoCredentials(
  repoUrl: string
): Promise<{ username: string | null; password: string | null }> {
  let username = null;
  let passwordValue = null;

  const requireCredentials = await confirm({
    message: "Does the repository require authentication?",
    default: false,
  });

  if (requireCredentials) {
    // TODO: use constants for credentials method

    const credentialsMethod = await select({
      message: "Select the credentials method",
      choices: [
        { name: "Username and password", value: "username-password" },
        { name: "Automatic GitLab access token", value: "gitlab" },
      ],
    });

    if (credentialsMethod === "username-password") {
      username = await input({
        message: "Enter the username",
        validate: (input) => {
          if (input === "") {
            return "Username cannot be empty";
          }

          return true;
        },
      });

      passwordValue = await password({
        message: "Enter the password",
        validate: (input) => {
          if (input === "") {
            return "Password cannot be empty";
          }

          return true;
        },
      });
    } else if (credentialsMethod === "gitlab") {
      const gitlabPersonalAccessToken = await password({
        message: "Enter the GitLab personal access token",
        validate: (input) => {
          if (input === "") {
            return "Personal access token cannot be empty";
          }

          return true;
        },
      });

      const gitlabRepoAccessToken = await createGitlabRepoAccessToken(
        repoUrl,
        gitlabPersonalAccessToken
      );

      username = "gitlab";
      passwordValue = gitlabRepoAccessToken;

      // TODO: handle invalid token
      // TODO: store gitlab credentials
    } else {
      throw new Error("Not implemented");
    }
  }

  return {
    username,
    password: passwordValue,
  };
}
