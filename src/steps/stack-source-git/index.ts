// TODO: allow configuration using options

import { RepoConfig } from "../../types/git"

import { askRepoConfig } from "./questions"

export default async function (): Promise<RepoConfig> {
  return await askRepoConfig()
}
