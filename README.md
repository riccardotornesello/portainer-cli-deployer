# Portainer CLI Deployer

[![npm version](https://badge.fury.io/js/portainer-cli-deployer.svg)](https://badge.fury.io/js/portainer-cli-deployer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Portainer CLI Deployer is a command-line tool designed to simplify the deployment of Docker stacks (using docker-compose) on Portainer directly from the terminal.

## Features

- 🚀 **Easy Deployment**: Deploy Docker stacks to Portainer with a simple CLI interface
- 🔐 **Secure Authentication**: Support for Portainer access tokens and Git repository credentials
- 🔄 **Git Integration**: Deploy stacks directly from Git repositories (GitLab, GitHub, Bitbucket)
- 💾 **Instance Management**: Save and reuse Portainer instance configurations
- 🌍 **Environment Variables**: Configure environment variables for your deployments
- 🪝 **Auto-updates**: Automatic webhook generation for stack updates

## Prerequisites

- Node.js >= 20.10.0
- A running Portainer instance
- Access to a Git repository with a docker-compose file (optional, for Git-based deployments)

## Installation

Install Portainer CLI Deployer globally using npm:

```bash
npm install -g portainer-cli-deployer
```

Or using yarn:

```bash
yarn global add portainer-cli-deployer
```

## Quick Start

To start using Portainer CLI Deployer, simply run:

```bash
portainer-cli-deployer
```

The interactive wizard will guide you through:

1. **Portainer Instance Setup**: Enter your Portainer URL and access token
2. **Environment Selection**: Choose the target environment (e.g., local, production)
3. **Stack Source**: Select your stack source (currently supports Git repositories)
4. **Repository Configuration**: Provide Git repository URL, branch, and compose file location
5. **Deployment Settings**: Configure stack name and environment variables
6. **Confirmation**: Review and confirm your deployment

## Usage Examples

### Basic Deployment

```bash
portainer-cli-deployer
```

Follow the interactive prompts to deploy your stack.

### Command-Line Options

```bash
portainer-cli-deployer --portainer-url https://portainer.example.com \
                       --portainer-access-token your-token-here
```

Available options:

- `--portainer-url <string>`: Portainer instance URL
- `--portainer-access-token <string>`: Portainer API access token
- `--portainer-instance <string>`: Use a saved Portainer instance
- `--portainer-insecure`: Skip SSL certificate verification (not recommended for production)

### Private Repository Authentication

For GitLab private repositories, the tool can automatically create project access tokens with read-only permissions. You'll be prompted for your GitLab personal access token.

For other Git hosts, you can provide your username and password when prompted.

## Configuration

### Portainer Access Token

To create a Portainer access token:

1. Log in to your Portainer instance
2. Go to **User Settings** → **Access tokens**
3. Click **Add access token**
4. Give it a descriptive name and click **Create**
5. Copy the token (you won't be able to see it again)

### Saved Instances

Portainer CLI Deployer saves your instance configurations in:

```
~/.portainer-cli-deployer/credentials.json
```

**Security Note**: This file contains sensitive credentials. Ensure it has appropriate permissions:

```bash
chmod 600 ~/.portainer-cli-deployer/credentials.json
```

## Troubleshooting

### SSL Certificate Errors

If you encounter SSL certificate verification errors with self-signed certificates:

```bash
portainer-cli-deployer --portainer-insecure
```

**Warning**: Only use this in trusted development environments.

### Authentication Issues

1. **Portainer Access Token**: Ensure your access token is valid and has not expired
2. **Git Credentials**: Verify your Git username/password or access token is correct
3. **Network Access**: Ensure you can reach both Portainer and your Git repository from your machine

### Common Errors

**"Portainer instance is not reachable"**

- Check your Portainer URL is correct
- Verify Portainer is running and accessible
- Check firewall rules if applicable

**"Unauthorized"**

- Your Portainer access token may be invalid or expired
- Create a new access token in Portainer

**"Repository not found" or "Authentication failed"**

- Verify the repository URL is correct
- Check your Git credentials are valid
- Ensure you have access to the repository

## Future Updates

In future versions, we plan to extend this capability to all major Git repository hosts, providing users with an easier experience across platforms.

### Roadmap

- [ ] Add support for Bitbucket private repositories automatically
- [ ] Add support for GitHub private repositories automatically
- [ ] Create authentication tokens only after the confirmation
- [ ] Allow not interactive use by passing all the required parameters as arguments
- [ ] Add support for deploying stacks from local files
- [ ] Add support for deploying stacks from a URL
- [ ] Add support for deploying stacks from a template
- [ ] Allow management of saved Portainer instances
- [ ] Allow saving GitLab's admin credentials

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

### Reporting Issues

If you encounter a bug or have a feature request, please open an issue on [GitHub](https://github.com/riccardotornesello/portainer-cli-deployer/issues).

### Security

For security vulnerabilities, please see our [Security Policy](SECURITY.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js/) for CLI functionality
- Uses [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for interactive prompts
- Powered by [Axios](https://github.com/axios/axios) for HTTP requests

## Support

If you find this tool helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code

For questions and support, please open an issue on GitHub.
