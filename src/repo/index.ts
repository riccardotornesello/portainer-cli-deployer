export * from "./gitlab"
export * from "./other"

export enum RepoHost {
  GITLAB,
  OTHER,
}

export const RepoHostDetails: Record<RepoHost, string> = {
  [RepoHost.GITLAB]: "Automatic GitLab access token",
  [RepoHost.OTHER]: "Username and password",
}
