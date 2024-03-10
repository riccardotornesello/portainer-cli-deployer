import axios from "axios";
import https from "https";
import { input, select } from "@inquirer/prompts";
import { z } from "zod";
import fs from "fs";
import yargs from "yargs";
import { v4 as uuidv4 } from "uuid";

const PREFIX = "prod"; // TODO
const ENV: EnvType[] = []; // TODO
const ENDPOINT_ID = 6; // TODO
const WEBHOOK_UUID = ""; // TODO
const DEFAULT_BRANCH = "main"; // TODO
const DEFAULT_DOCKER_COMPOSE_FILE = "docker-compose.prod.yml"; // TODO

const configurationSchema = z.object({
  gitlab: z.object({
    baseUrl: z.string(),
    accessToken: z.string(),
  }),
  portainer: z.object({
    baseUrl: z.string(),
    accessToken: z.string(),
  }),
});
type ConfigurationType = z.infer<typeof configurationSchema>;

type EnvType = { name: string; value: string };

async function createGitlabProjectToken({
  configuration,
  repoPath,
}: {
  configuration: ConfigurationType;
  repoPath: string;
}) {
  const gitlabTokenData = {
    name: `portainer-${PREFIX}-pull`,
    access_level: 20,
    scopes: ["read_repository"],
    expires_at: null,
  };

  const gitlabProjectId = encodeURIComponent(repoPath);

  let res = await axios.post(
    `${configuration.gitlab.baseUrl}/api/v4/projects/${gitlabProjectId}/access_tokens`,
    gitlabTokenData,
    {
      headers: {
        "PRIVATE-TOKEN": configuration.gitlab.accessToken,
      },
    }
  );

  const gitlabProjectToken = res.data.token;

  return gitlabProjectToken;
}

async function createPortainerStack({
  configuration,
  gitlabProjectToken,
  repoPath,
  branch,
  composeFile,
  environmentVariables,
}: {
  configuration: ConfigurationType;
  gitlabProjectToken: string;
  repoPath: string;
  branch: string;
  composeFile: string;
  environmentVariables: EnvType[];
}) {
  const repoUrl = `${configuration.gitlab.baseUrl}/${repoPath}.git`;
  const repoName = repoPath.split("/").slice(-1)[0];
  const projectName = `${PREFIX}_${repoName}`;

  const webhookUuid = WEBHOOK_UUID || uuidv4();

  const stackData = {
    method: "repository",
    type: "standalone",
    Name: projectName,
    RepositoryURL: repoUrl,
    RepositoryReferenceName: `refs/heads/${branch}`,
    ComposeFile: composeFile,
    AdditionalFiles: [],
    RepositoryAuthentication: true,
    RepositoryUsername: "user",
    RepositoryPassword: gitlabProjectToken,
    Env: environmentVariables,
    TLSSkipVerify: false,
    AutoUpdate: {
      Interval: "",
      Webhook: webhookUuid,
      ForceUpdate: true,
      ForcePullImage: true,
    },
  };

  const res = await axios.post(
    `${configuration.portainer.baseUrl}/stacks/create/standalone/repository?endpointId=${ENDPOINT_ID}`,
    stackData,
    {
      headers: {
        "X-API-Key": configuration.portainer.accessToken,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // TODO: validate HTTPS
    }
  );

  return { webhookUuid };
}

async function main() {
  const options = await yargs
    .option("configuration", {
      alias: "c",
      describe: "The cofniguration file path",
      type: "string",
      default: "./config.json",
    })
    .help(true).argv;

  // Read the configuration file
  let configurationObject;
  try {
    const configurationData = fs.readFileSync(options.configuration, "utf8");
    configurationObject = JSON.parse(configurationData);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.error("Error: configuration file not found.");
    } else if (error instanceof SyntaxError) {
      console.error("Error: configuration file is not a valid JSON.");
    } else {
      console.error("Unknown error: ", error);
    }
    process.exit(1);
  }

  // Validate the configuration
  let configuration;
  try {
    configuration = configurationSchema.parse(configurationObject);
  } catch (error: any) {
    console.error("Error: configuration is not valid.", error);
    process.exit(1);
  }

  const repoPath = await input({
    message: "What's the repo path? Ex. group/project/testrepo",
    validate: (value) => {
      if (!value.includes("/")) {
        return "Please enter a valid repo path: the slash is missing";
      } else if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("git@")
      ) {
        return "Please enter the repo path without the protocol and domain. Ex. group/project/testrepo";
      } else if (value.endsWith(".git")) {
        return "Please enter the repo path without the .git extension";
      } else if (value.endsWith("/")) {
        return "Please enter the repo path without the trailing slash";
      } else {
        return true;
      }
    },
  });
  const branch = await input({
    message: "What's the branch name?",
    default: DEFAULT_BRANCH,
  });
  const composeFile = await input({
    message: "What's the compose file name?",
    default: DEFAULT_DOCKER_COMPOSE_FILE,
  });

  const gitlabProjectToken = await createGitlabProjectToken({
    configuration: configuration,
    repoPath: repoPath,
  });

  const { webhookUuid } = await createPortainerStack({
    configuration: configuration,
    gitlabProjectToken: gitlabProjectToken,
    repoPath: repoPath,
    branch: branch,
    composeFile: composeFile,
    environmentVariables: ENV,
  });

  console.log("Webhook UUID: ", webhookUuid);
}

main();
