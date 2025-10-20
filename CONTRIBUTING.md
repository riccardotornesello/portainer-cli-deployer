# Contributing to Portainer CLI Deployer

Thank you for your interest in contributing to Portainer CLI Deployer! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your changes
4. Make your changes
5. Push to your fork and submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 20.10.0
- Yarn package manager

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/portainer-cli-deployer.git
cd portainer-cli-deployer

# Install dependencies
yarn install

# Build the project
yarn build

# Run in development mode
yarn dev
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (OS, Node.js version, etc.)
- Any relevant logs or error messages

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any potential drawbacks or alternatives considered

### Code Contributions

1. **Find an issue to work on** or create a new one to discuss your idea
2. **Fork and clone** the repository
3. **Create a branch** with a descriptive name (e.g., `feature/add-bitbucket-support` or `fix/credential-validation`)
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Commit your changes** using conventional commit messages
7. **Push to your fork** and create a pull request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use strict type checking
- Avoid `any` types when possible

### Code Style

- We use Prettier for code formatting
- Run `yarn format` before committing
- Follow existing patterns in the codebase
- Add comments for complex logic

### File Organization

- Place new features in appropriate directories under `src/`
- Keep files focused and single-purpose
- Use clear, descriptive names for files and variables

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(gitlab): add support for self-hosted GitLab instances

fix(auth): properly handle expired access tokens

docs(readme): add troubleshooting section
```

## Pull Request Process

1. **Update documentation** if you've made changes that affect it
2. **Ensure the build passes**: Run `yarn build` successfully
3. **Format your code**: Run `yarn format`
4. **Write a clear PR description** explaining:
   - What changes you made
   - Why you made them
   - Any breaking changes
   - Related issues (use "Fixes #123" or "Closes #123")
5. **Wait for review**: A maintainer will review your PR
6. **Address feedback**: Make any requested changes
7. **Merge**: Once approved, a maintainer will merge your PR

### PR Title Format

Use the same format as commit messages:

```
feat: add support for Bitbucket repositories
fix: resolve issue with credential storage
```

## Questions?

Feel free to open an issue with the label `question` if you need help or clarification on anything!

## License

By contributing to Portainer CLI Deployer, you agree that your contributions will be licensed under the MIT License.
