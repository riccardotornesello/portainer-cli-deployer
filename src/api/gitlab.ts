import axios from "axios"

export async function createGitlabRepoAccessToken(
  repoUrl: string,
  personalAccessToken: string
) {
  const gitlabTokenData = {
    name: `portainer-pull`,
    access_level: 20,
    scopes: ["read_repository"],
    expires_at: null,
  }

  const gitlabBaseUrl = repoUrl.split("/").slice(0, 3).join("/")
  const repoPath = repoUrl.split("/").slice(3).join("/").replace(".git", "")

  const gitlabProjectId = encodeURIComponent(repoPath)

  let res = await axios.post(
    `${gitlabBaseUrl}/api/v4/projects/${gitlabProjectId}/access_tokens`,
    gitlabTokenData,
    {
      headers: {
        "PRIVATE-TOKEN": personalAccessToken,
      },
    }
  )

  const gitlabProjectToken = res.data.token

  return gitlabProjectToken
}
