import axios from "axios"

export async function createBitbucketRepoAccessToken(
  repoUrl: string,
  personalAccessToken: string
) {
  // Bitbucket Cloud uses app passwords for authentication
  // We'll validate the token has access to the repository and return it

  const bitbucketBaseUrl = repoUrl.split("/").slice(0, 3).join("/")
  const repoPath = repoUrl.split("/").slice(3).join("/").replace(".git", "")
  const [workspace, repoSlug] = repoPath.split("/")

  // Validate the token by checking if we can access the repository
  try {
    await axios.get(
      `${bitbucketBaseUrl}/api/2.0/repositories/${workspace}/${repoSlug}`,
      {
        headers: {
          Authorization: `Bearer ${personalAccessToken}`,
        },
      }
    )

    // If successful, return the app password itself
    // as it's already valid for the repository
    return personalAccessToken
  } catch (error) {
    // If bitbucket.org, try the public API endpoint
    if (bitbucketBaseUrl === "https://bitbucket.org") {
      try {
        await axios.get(
          `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}`,
          {
            headers: {
              Authorization: `Bearer ${personalAccessToken}`,
            },
          }
        )
        return personalAccessToken
      } catch {
        return null
      }
    }
    return null
  }
}
