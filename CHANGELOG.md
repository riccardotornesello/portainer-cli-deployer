# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Production readiness improvements
- Security policy documentation (SECURITY.md)
- Contributing guidelines (CONTRIBUTING.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- Keywords for better npm discoverability
- Node.js version requirement (>=20.10.0)

### Changed

- Updated axios from ^1.6.5 to ^1.12.2 (security update)
- Updated @inquirer/prompts from ^4.2.1 to ^7.9.0 (security update)

### Security

- Fixed vulnerabilities in dependencies (axios, @inquirer/prompts)
- Documented credential storage security considerations

## [0.1.0] - 2024-01-XX

### Added

- Initial release
- Deploy Docker stacks to Portainer from CLI
- Interactive deployment wizard
- Support for Git repositories as stack source
- GitLab private repository authentication
- Automatic GitLab access token creation
- Save and reuse Portainer instances
- Environment variable configuration
- Support for insecure HTTPS connections (development)

### Features

- Select Portainer instance and environment
- Configure stack from Git repository
- Set custom environment variables
- Automatic webhook generation for stack updates

[Unreleased]: https://github.com/riccardotornesello/portainer-cli-deployer/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/riccardotornesello/portainer-cli-deployer/releases/tag/v0.1.0
