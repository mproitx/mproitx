# Contributing to PM - Roit Study Hub

Thank you for your interest in contributing to PM - Roit Study Hub! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (browser, OS, etc.)

### Suggesting Features

Feature requests are welcome! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Any implementation ideas

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**
   ```bash
   pnpm lint
   pnpm build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Naming Conventions
- Components: PascalCase (e.g., `StudentDashboard.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Code Organization
- Group related functionality
- Keep files under 300 lines
- Extract reusable logic into hooks

### Comments
- Write comments in Hindi for UI-related code
- Write comments in English for logic/utility code
- Document complex algorithms

## Development Workflow

1. **Setup Development Environment**
   ```bash
   pnpm install
   cp .env.example .env
   # Add your Supabase credentials to .env
   pnpm dev
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow existing patterns
   - Test thoroughly

3. **Before Committing**
   ```bash
   pnpm lint
   ```

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Refactor: what was refactored`
- `Docs: documentation changes`
- `Style: formatting changes`

## Questions?

Feel free to create an issue or reach out to masumboy141@gmail.com

Thank you for contributing! 🙏
