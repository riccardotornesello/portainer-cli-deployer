# Testing Guide

## Current State

This project does not currently have automated unit tests. Testing is performed manually through the interactive CLI interface.

## Manual Testing Checklist

### Prerequisites
- A running Portainer instance (can be local or remote)
- A test Git repository with a docker-compose file

### Basic Functionality Tests

1. **Installation Test**
   ```bash
   npm install -g portainer-cli-deployer
   portainer-cli-deployer --help
   ```

2. **First-Time Setup**
   - Run `portainer-cli-deployer`
   - Enter a new Portainer instance URL
   - Enter a valid Portainer access token
   - Verify connection succeeds

3. **Environment Selection**
   - Select an environment from the list
   - Verify environment is accessible

4. **Git Repository Deployment**
   - Choose "Git repository" as stack source
   - Enter repository URL (test both public and private)
   - Enter branch name
   - Enter compose file path (e.g., `docker-compose.yml`)
   - Configure stack name
   - Add environment variables (optional)
   - Confirm deployment
   - Verify stack appears in Portainer

5. **Saved Instance Test**
   - Run `portainer-cli-deployer` again
   - Select saved instance from list
   - Verify credentials are loaded correctly

### Edge Cases to Test

- Invalid Portainer URL
- Expired/invalid access token
- Non-existent Git repository
- Invalid branch name
- Missing docker-compose file
- Network connectivity issues
- Self-signed SSL certificates (with `--portainer-insecure`)

### Security Testing

1. **Credential Storage**
   ```bash
   ls -la ~/.portainer-cli-deployer/
   cat ~/.portainer-cli-deployer/credentials.json
   ```
   - Verify credentials file exists
   - Check file permissions (should be restrictive)
   - Verify credentials are stored correctly

2. **SSL Verification**
   - Test with valid SSL certificate
   - Test with self-signed certificate (should fail without `--portainer-insecure`)
   - Test with `--portainer-insecure` flag

### Integration Testing

Test with different Portainer setups:
- Local Portainer instance
- Remote Portainer instance
- Portainer with multiple environments
- Portainer behind a proxy

Test with different Git hosts:
- GitHub public repository
- GitLab public repository
- Bitbucket public repository
- Private repositories with authentication

## Future Testing Plans

### Unit Tests
We plan to add unit tests for:
- [ ] API client functions
- [ ] Input validation
- [ ] Configuration management
- [ ] Git URL parsing
- [ ] Credential storage/retrieval

### Integration Tests
- [ ] End-to-end deployment workflow
- [ ] Portainer API integration
- [ ] Git repository integration
- [ ] Authentication flows

### Test Framework Recommendations
- **Jest** or **Vitest** for unit tests
- **Mock Service Worker (MSW)** for API mocking
- **TypeScript** test files for type safety

## Contributing Tests

If you'd like to contribute tests:
1. See [CONTRIBUTING.md](CONTRIBUTING.md) for general contribution guidelines
2. Create unit tests in a `__tests__` directory alongside the code
3. Use descriptive test names following the pattern: `describe('Feature') { it('should do X') { ... } }`
4. Aim for >80% code coverage on new code
5. Update this document with any new testing procedures

## Reporting Test Failures

If you encounter issues during manual testing:
1. Document the exact steps to reproduce
2. Include error messages and logs
3. Note your environment (OS, Node.js version, Portainer version)
4. Open an issue on GitHub with the label `bug`
