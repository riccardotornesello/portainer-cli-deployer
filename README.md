# Portainer CLI Deployer

Portainer CLI Deployer is a command-line tool designed to simplify the deployment of Docker stacks (using docker-compose) on Portainer directly from the terminal.

## Installation

Install Portainer CLI Deployer globally using npm:

```bash
npm install -g portainer-cli-deployer
```

## Getting Started

To start using Portainer CLI Deployer, simply run the following command:

```bash
portainer-cli-deployer
```

This command will initiate the deployment process and guide you through a series of questions to select the Portainer instance and environment, as well as the Git repository from which to read the docker-compose file.

If the repository is private, you will have the option to provide your username and password. Additionally, in this version, if the private repository is hosted on Gitlab, you can follow a guided procedure to automatically create an authentication token.

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

## Feedback and Contributions

We welcome feedback and contributions from the community. Feel free to open an issue or submit a pull request on [GitHub](https://github.com/riccardotornesello/portainer-cli-deployer) to help us improve Portainer CLI Deployer.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
