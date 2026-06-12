# Contributing to SentinelX AI

Thank you for your interest in contributing to SentinelX AI! This document provides guidelines and information for contributors.

## 🎯 Project Overview

SentinelX is an Autonomous AI Governance & Compliance Fabric for Banking. It serves as a governance war room for financial institutions, providing real-time regulation ingestion, digital twin topology, risk simulation, and executive intelligence briefings.

## 🛠️ Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SHRIHARI1509/SentinalX-AI.git
   cd SentinalX-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs
- Use the GitHub Issues tab to report bugs
- Include steps to reproduce, expected behavior, and actual behavior
- Add relevant labels (bug, enhancement, etc.)

### Suggesting Enhancements
- Open an issue with the `enhancement` label
- Describe the feature, its benefits, and potential implementation approaches
- Include mockups or diagrams if applicable

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🏗️ Architecture Guidelines

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js with TypeScript (`tsx` runtime)
- **AI Integration:** Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Keep components focused and modular
- Add JSDoc comments for public APIs

### Commit Messages
We follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
