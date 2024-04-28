import { StackSource, RepoHost } from "../types/stack-sources"

export const StackSourceDetails: Record<StackSource, string> = {
  [StackSource.GIT]: "Git",
}

export const RepoHostDetails: Record<RepoHost, string> = {
  [RepoHost.GITLAB]: "Automatic GitLab access token",
  [RepoHost.OTHER]: "Username and password",
}
