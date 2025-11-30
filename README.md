# MFT - Component Libraries

A monorepo of reusable Vue.js component libraries.

## Packages

### @miscmft/vue-print-format

Vue 3 components for creating print-ready, multi-page documents with automatic pagination and overflow handling.

📦 [Package Documentation](./packages/vue-print-format/README.md)

## Installation

```bash
# Install a specific package
npm install @miscmft/vue-print-format
# or
yarn add @miscmft/vue-print-format
```

## Development

This monorepo uses Yarn workspaces for managing multiple packages.

### Setup

```bash
# Install dependencies for all packages
yarn install

# Build all packages
yarn build

# Run development mode for a specific package
yarn workspace @miscmft/vue-print-format dev

# Lint all packages
yarn lint

# Check for outdated dependencies
yarn outdated

# Run security audit
yarn security
```

### Project Structure

```
mft/
├── packages/
│   └── vue-print-format/     # Print document components
│       ├── src/              # Source code
│       ├── dist/             # Build output
│       └── README.md         # Package documentation
├── package.json              # Workspace root configuration
└── README.md                 # This file
```

## Publishing

To publish a package to npm:

```bash
cd packages/vue-print-format
yarn build
npm publish --access public
```

## License

MIT - See LICENSE file for details
