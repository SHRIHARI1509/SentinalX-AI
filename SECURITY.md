# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of SentinelX AI seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT open a public issue** for the vulnerability.
2. Email the project maintainers directly with details of the vulnerability.
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## What to Expect

- We will acknowledge receipt of your report within 48 hours.
- We will provide an estimated timeline for a fix.
- We will notify you when the vulnerability is resolved.
- With your permission, we will credit you in the security advisory.

## Security Best Practices for Contributors

- Never commit `.env` files or API keys to the repository
- Use environment variables for all sensitive configuration
- Keep dependencies up to date (`npm audit`)
- Follow the principle of least privilege for all integrations
- Report any suspicious activity or potential vulnerabilities

## Dependencies

This project uses the following key dependencies:
- **@google/genai** - Google Gemini AI SDK
- **Express.js** - Web server framework
- **React + Vite** - Frontend framework

Regular security audits should be performed using `npm audit` to ensure all dependencies are up to date.
