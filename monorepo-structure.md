# Test Automation Converter - Monorepo Structure

## Directory Structure
```
test-automation-converter/
├── package.json                    # Root workspace configuration
├── tsconfig.json                   # Root TypeScript configuration
├── .eslintrc.js                    # Root ESLint configuration
├── .gitignore
├── .changeset/
│   └── config.json                 # Changeset configuration
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── base/
│   │       ├── ast/
│   │       ├── config/
│   │       ├── fs/
│   │       ├── progress/
│   │       └── types/
│   ├── cjs-to-esm/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── converter.ts
│   │       ├── analyzers/
│   │       ├── transformers/
│   │       └── patterns/
│   ├── js-to-ts/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── converter.ts
│   │       ├── inference/
│   │       ├── generators/
│   │       └── config/
│   ├── wdio-to-playwright/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── converter.ts
│   │       ├── mappings/
│   │       ├── analyzers/
│   │       ├── transformers/
│   │       └── config/
│   └── cucumber-to-playwright/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── converter.ts
│           ├── parser/
│           ├── analyzers/
│           └── generators/
├── cli/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       └── commands/
├── integration/
│   ├── package.json
│   ├── tsconfig.json
│   └── tests/
└── docs/
    └── README.md
```

## Root package.json
```json
{
  "name": "test-automation-converter",
  "version": "0.0.0",
  "private": true,
  "description": "A modular npm toolkit for converting test automation projects",
  "keywords": [
    "test-automation",
    "converter",
    "cjs",
    "esm",
    "typescript",
    "webdriverio",
    "playwright",
    "cucumber",
    "migration",
    "ast"
  ],
  "homepage": "https://github.com/yourusername/test-automation-converter",
  "bugs": {
    "url": "https://github.com/yourusername/test-automation-converter/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/test-automation-converter.git"
  },
  "license": "MIT",
  "author": "Your Name <your.email@example.com>",
  "type": "module",
  "workspaces": [
    "packages/*",
    "cli",
    "integration"
  ],
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "build:watch": "npm run build:watch --workspaces --if-present",
    "clean": "npm run clean --workspaces --if-present && rm -rf node_modules",
    "dev": "npm run dev --workspaces --if-present",
    "lint": "eslint . --ext .ts,.js",
    "lint:fix": "eslint . --ext .ts,.js --fix",
    "test": "npm run test --workspaces --if-present",
    "test:coverage": "npm run test:coverage --workspaces --if-present",
    "typecheck": "tsc --noEmit",
    "changeset": "changeset",
    "version": "changeset version && npm install --package-lock-only",
    "release": "npm run build && changeset publish",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "@vitest/coverage-v8": "^1.0.0",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.0.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "prettier": "^3.1.0",
    "typescript": "^5.7.3",
    "vitest": "^1.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Root tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/cjs-to-esm" },
    { "path": "./packages/js-to-ts" },
    { "path": "./packages/wdio-to-playwright" },
    { "path": "./packages/cucumber-to-playwright" },
    { "path": "./cli" },
    { "path": "./integration" }
  ],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

## Root .eslintrc.js
```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json', './packages/*/tsconfig.json', './cli/tsconfig.json']
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules', '*.js', '!.eslintrc.js']
};
```

## Root .gitignore
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Production
dist/
build/
*.tsbuildinfo

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
.cache/

# Changeset
.changeset/*.md
!.changeset/config.json
```

## Changeset Configuration (.changeset/config.json)
```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [
    ["@test-converter/*", "test-automation-converter-cli"]
  ],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@test-converter/integration"]
}
```

## packages/core/package.json
```json
{
  "name": "@test-converter/core",
  "version": "0.1.0",
  "description": "Core infrastructure for test automation converter",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./ast": {
      "types": "./dist/ast/index.d.ts",
      "import": "./dist/ast/index.js"
    },
    "./config": {
      "types": "./dist/config/index.d.ts",
      "import": "./dist/config/index.js"
    },
    "./fs": {
      "types": "./dist/fs/index.d.ts",
      "import": "./dist/fs/index.js"
    },
    "./types": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/types/index.js"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc -b",
    "build:watch": "tsc -b -w",
    "clean": "rm -rf dist *.tsbuildinfo",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@babel/generator": "^7.23.0",
    "@babel/parser": "^7.23.0",
    "@babel/traverse": "^7.23.0",
    "@babel/types": "^7.23.0",
    "chalk": "^5.3.0",
    "diff": "^5.1.0",
    "fs-extra": "^11.2.0",
    "glob": "^10.3.10",
    "inquirer": "^9.2.12",
    "ora": "^8.0.1",
    "prettier": "^3.1.0"
  },
  "devDependencies": {
    "@types/babel__generator": "^7.6.7",
    "@types/babel__traverse": "^7.20.4",
    "@types/diff": "^5.0.8",
    "@types/fs-extra": "^11.0.4",
    "@types/inquirer": "^9.0.7"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## packages/cjs-to-esm/package.json
```json
{
  "name": "@test-converter/cjs-to-esm",
  "version": "0.1.0",
  "description": "Convert CommonJS modules to ES modules",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc -b",
    "build:watch": "tsc -b -w",
    "clean": "rm -rf dist *.tsbuildinfo",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@test-converter/core": "workspace:*"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## packages/js-to-ts/package.json
```json
{
  "name": "@test-converter/js-to-ts",
  "version": "0.1.0",
  "description": "Convert JavaScript to TypeScript with intelligent type inference",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc -b",
    "build:watch": "tsc -b -w",
    "clean": "rm -rf dist *.tsbuildinfo",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@test-converter/core": "workspace:*",
    "typescript": "^5.7.3"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## packages/wdio-to-playwright/package.json
```json
{
  "name": "@test-converter/wdio-to-playwright",
  "version": "0.1.0",
  "description": "Convert WebdriverIO tests to Playwright",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc -b",
    "build:watch": "tsc -b -w",
    "clean": "rm -rf dist *.tsbuildinfo",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@test-converter/core": "workspace:*"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## packages/cucumber-to-playwright/package.json
```json
{
  "name": "@test-converter/cucumber-to-playwright",
  "version": "0.1.0",
  "description": "Convert Cucumber tests to Playwright Test format",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc -b",
    "build:watch": "tsc -b -w",
    "clean": "rm -rf dist *.tsbuildinfo",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@cucumber/gherkin": "^28.0.0",
    "@cucumber/messages": "^24.0.0",
    "@test-converter/core": "workspace:*"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## cli/package.json
```json
{
  "name": "test-automation-converter-cli",
  "version": "0.1.0",
  "description": "CLI for test automation converter",
  "type": "module",
  "bin": {
    "test-converter": "./dist/index.js"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc -b && chmod +x dist/index.js",
    "build:watch": "tsc -b -w",
    "clean": "rm -rf dist *.tsbuildinfo",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@test-converter/core": "workspace:*",
    "@test-converter/cjs-to-esm": "workspace:*",
    "@test-converter/js-to-ts": "workspace:*",
    "@test-converter/wdio-to-playwright": "workspace:*",
    "@test-converter/cucumber-to-playwright": "workspace:*",
    "commander": "^11.1.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## integration/package.json
```json
{
  "name": "@test-converter/integration",
  "version": "0.1.0",
  "private": true,
  "description": "Integration tests for test automation converter",
  "type": "module",
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@test-converter/core": "workspace:*",
    "@test-converter/cjs-to-esm": "workspace:*",
    "@test-converter/js-to-ts": "workspace:*",
    "@test-converter/wdio-to-playwright": "workspace:*",
    "@test-converter/cucumber-to-playwright": "workspace:*",
    "test-automation-converter-cli": "workspace:*"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## Package-specific tsconfig.json (example for packages/core/tsconfig.json)
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

## Setup Instructions

1. **Initialize the monorepo:**
```bash
mkdir test-automation-converter
cd test-automation-converter
npm init -y
```

2. **Copy the root package.json and install dependencies:**
```bash
# Copy the root package.json content above
npm install
```

3. **Create the directory structure:**
```bash
# Create all directories
mkdir -p packages/{core,cjs-to-esm,js-to-ts,wdio-to-playwright,cucumber-to-playwright}/src
mkdir -p cli/src/commands
mkdir -p integration/tests
mkdir -p .changeset
mkdir docs
```

4. **Copy all configuration files and package.json files to their locations**

5. **Bootstrap the workspaces:**
```bash
npm install
npm run build
```

6. **Initialize changesets:**
```bash
npx changeset init
```

## Benefits of This Structure

1. **Independent Development**: Each package can be developed and tested separately
2. **Clear Dependencies**: Explicit dependencies between packages
3. **Version Management**: Changesets handle versioning and changelogs
4. **Type Safety**: TypeScript project references ensure type checking across packages
5. **Efficient Builds**: Only changed packages need rebuilding
6. **Professional Publishing**: Ready for npm publishing with proper scoping

## Development Workflow

1. **Make changes in a package**
2. **Run tests**: `npm test -w @test-converter/core`
3. **Build**: `npm run build -w @test-converter/core`
4. **Create changeset**: `npm run changeset`
5. **Version packages**: `npm run version`
6. **Publish**: `npm run release`
