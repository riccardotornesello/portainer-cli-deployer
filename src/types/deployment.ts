export type DeploymentConfig = {
  stackName: string;
  environmentVariables: EnvironmentVariable[];
};

export type EnvironmentVariable = {
  name: string;
  value: string;
};
