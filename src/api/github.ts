import axios from "axios"

export async function createGithubRepoAccessToken(
  repoUrl: string,
  personalAccessToken: string
) {
  // GitHub doesn't have a simple API to create repository-scoped tokens like GitLab
  // Fine-grained tokens require OAuth flow which is not suitable for CLI
  // We'll validate the token has access to the repository and return it

  const githubBaseUrl = repoUrl.split("/").slice(0, 3).join("/")
  const repoPath = repoUrl.split("/").slice(3).join("/").replace(".git", "")
  const [owner, repo] = repoPath.split("/")

  // Validate the token by checking if we can access the repository
  try {
    await axios.get(`${githubBaseUrl}/api/v3/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    // If successful, return the personal access token itself
    // as it's already valid for the repository
    return personalAccessToken
  } catch (error) {
    // If github.com, try the public API endpoint
    if (githubBaseUrl === "https://github.com") {
      try {
        await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `Bearer ${personalAccessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
        return personalAccessToken
      } catch {
        return null
      }
    }
    return null
  }
}
