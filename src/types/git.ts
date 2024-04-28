export type RepoCredentials = {
  username: string
  password: string
}

export type RepoConfig = {
  repoUrl: string
  branch: string
  composeFileName: string
  credentials: RepoCredentials | null
}

export interface RepoHostInterface {
  authenticate(): Promise<RepoCredentials>
}
