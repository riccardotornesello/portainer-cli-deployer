# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Portainer CLI Deployer, please send an email to the maintainer via the email address listed on the [GitHub profile](https://github.com/riccardotornesello). All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the issue until it has been addressed by the maintainers.

### What to include in your report

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a detailed response within 7 days indicating the next steps
- We will notify you when the vulnerability has been fixed

## Security Best Practices

When using Portainer CLI Deployer:

1. **Credential Storage**: Credentials are stored locally in `~/.portainer-cli-deployer/credentials.json`. Ensure this file has appropriate permissions (recommended: `chmod 600`).

2. **Access Tokens**: Use access tokens with minimal required permissions. For Portainer, create tokens with only the necessary scopes.

3. **HTTPS**: Always use HTTPS URLs for Portainer instances unless you explicitly trust the network (using `--portainer-insecure` flag).

4. **Repository Credentials**: When authenticating to private repositories, prefer using access tokens over passwords.

5. **Environment Variables**: Be cautious when setting environment variables for deployments, as they may contain sensitive information.

## Known Security Considerations

### Credential Storage

Credentials are stored in plain text in the local configuration file. Users should:

- Ensure proper file permissions on the configuration directory
- Be aware that any process with user-level access can read these credentials
- Consider using environment variables for sensitive deployments

### Network Security

When using the `--portainer-insecure` flag, SSL/TLS certificate verification is disabled. This should only be used in trusted development environments.
