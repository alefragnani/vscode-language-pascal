# Pascal Language Extension for VS Code

Always reference these instructions first and fall back to additional search or terminal commands only when project files do not provide enough context.

## Project Overview

This is a VS Code extension that provides Pascal language support including syntax highlighting, snippets, and code navigation features for Pascal, Delphi, and FreePascal.

## Technology Stack

- Language: TypeScript
- Runtime: VS Code Extension API (Node + Web)
- Bundler: Webpack 5
- Linting: ESLint (`eslint-config-vscode-ext`)
- Testing: Mocha + `@vscode/test-electron`

## Working Effectively

Bootstrap and local setup:

```bash
git submodule init
git submodule update
npm install
```

Build and development quickstart:

```bash
npm run build
npm run lint
```

- Use `npm run watch` during active development.
- Use VS Code "Launch Extension" (F5) to validate behavior in Extension Development Host.
- Expected command timings are usually under 10 seconds.
- Never cancel `npm install`, `npm run watch`, or `npm test` once started.
## Build and Development Commands

- `npm run compile` - TypeScript compilation
- `npm run build` - Webpack development build
- `npm run watch` - Continuous webpack build
- `npm run lint` - ESLint validation
- `npm run test` - Full test suite
- `npm run vscode:prepublish` - Production build

## Testing and Validation

**IMPORTANT**: Testing requires VS Code to be running and cannot be executed in headless environments.
- `npm test` -- runs full test suite including compilation, linting, and VS Code extension tests
- `npm run just-test` -- runs only the VS Code extension tests (requires VS Code)
- Tests are located in `src/test/suite/` and use Mocha framework

In headless environments, you can validate your changes with:
- `npm run compile` -- ensure TypeScript compiles without errors
- `npm run lint` -- ensure code style compliance
- `npm run build` -- ensure webpack bundling succeeds

### Essential Manual Testing
1. **Extension Loading**: Verify extension loads without errors in VS Code
2. **Syntax Highlighting**: Open a `.pas` file and verify Pascal syntax is highlighted correctly
   - Create test file: `program HelloWorld; begin writeln('Hello, World!'); end.`
   - Verify keywords like `program`, `begin`, `end` are highlighted
3. **Snippets**: Test Pascal code snippets in a `.pas` file:
   - Type "begin" and verify snippet expansion with begin/end block
   - Type "classc" for class with constructor/destructor
   - Type "case" for case statement
4. **Commands**: Test Pascal commands via Command Palette:
   - "Pascal: Generate Tags" (requires GNU Global - may show error if not installed)
   - "Pascal: Update Tags" (requires GNU Global)
   - "Pascal: New File" commands

## Project Structure and Key Files

```
src/
├── providers/            # Language feature providers (definition, references, symbols, tags)
├── commands/             # Extension commands (file creation, tag generation)
├── test/                 # Test suite
└── extension.ts          # Extension activation

dist/                     # Webpack bundles (extension-node.js, extension-web.js)
l10n/                     # Localization files
out/                      # Compiled TypeScript files
syntaxes/                 # TextMate grammar for Pascal syntax
snippets/                 # Pascal code snippets
vscode-whats-new/         # Git submodule for What's New
walkthrough/              # Getting Started walkthrough content

pascal.configuration.json # Language configuration

```

## Coding Conventions and Patterns

### Indentation

- Use spaces, not tabs.
- Use 4 spaces for indentation.

### Naming Conventions

- Use PascalCase for `type` names
- Use PascalCase for `enum` values
- Use camelCase for `function` and `method` names
- Use camelCase for `property` names and `local variables`
- Use whole words in names when possible

### Types

- Do not export `types` or `functions` unless you need to share it across multiple components
- Do not introduce new `types` or `values` to the global namespace
- Prefer `const` over `let` when possible.

### Strings

- Prefer double quotes for new code; some existing files may still use single quotes.
- User-facing strings use two localization mechanisms:
  - **Manifest contributions** (commands, settings, walkthrough metadata): use `%key%` placeholders in `package.json`, with translations in `package.nls.json` and `package.nls.{LANGID}.json`. Do **not** use `l10n.t` for these.
  - **Runtime messages** (shown from extension code): use `l10n.t("message")`, with translations in `l10n/bundle.l10n.json` and `l10n/bundle.l10n.{LANGID}.json`.
- Externalized strings must not use string concatenation. Use placeholders instead (`{0}`).

### Code Quality

- All production source files under `src/` (excluding tests under `src/test`) must include the standard project copyright header
- Prefer `async` and `await` over `Promise` and `then` calls
- All user facing messages must be localized using the applicable localization framework (for example `l10n.t` method)
- Keep imports organized: VS Code first, then internal modules.
- Use semicolons at the end of statements.
- Keep changes minimal and aligned with existing style.

### Import Organization

- Import VS Code API first: `import * as vscode from "vscode"`
- Group related imports together
- Use named imports for specific VS Code types
- Import from local modules using relative paths

## Extension Features and Configuration

### Key Features
1. **Syntax Highlighting**: Syntax highlighting for `.pas`, `.p`, `.dfm`, `.fmx`, `.dpr`, `.dpk`, `.lfm`, `.lpr`, `.ppr` files
2. **Code Snippets**: Code snippets for Pascal constructs
3. **File Creation Commands**: New Pascal file, class, interface, program
4. **Code Navigation**: When GNU Global tools are installed
5. **Multi-root workspace**: Manage Pascal projects per workspace folder
6. **Remote Development**: Support for remote development scenarios
7. **Internationalization support**: Localization of all user-facing strings
8. **Walkthrough**: Getting Started guide for new users

## Dependencies and External Tools

- Requires `vscode-whats-new` submodule initialization.
- Code navigation features require external tools that may not be available in all environments:
  - GNU Global 6.5+
  - Exuberant Tags 5.5+
  - Python 2.7+ with Pygments (`pip install Pygments`)

**Linux Installation**:
```bash
sudo apt update
sudo apt install global exuberant-ctags python3-pygments
export GTAGSCONF=/etc/gtags.conf
export GTAGSLABEL=pygments
```
## Troubleshooting and Known Limitations

- Extension tests require VS Code and may fail in restricted/headless environments.
- If navigation features are unavailable, verify GNU Global/ctags/Pygments installation.
- Extension requires trusted workspace for code navigation features.
- If build fails after dependency updates, remove `dist/` and `out/`, then rebuild.

## CI and Pre-Commit Validation

Before committing:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Run `npm run test-compile`.

## Common Tasks

### Development Workflow

1. Run `npm run watch` to start development mode.
2. Open VS Code and use "Launch Extension" from `.vscode/launch.json`.
3. Make changes to TypeScript files in `src/`.
4. Use "Reload Window" in Extension Development Host to test changes.
5. Always run `npm run lint` before committing changes.

### Repository Root Contents

```
.github/          - GitHub workflows and templates
.vscode/          - VS Code workspace settings and launch configs
dist/             - Built extension files (after npm run build)
out/              - Compiled TypeScript (after npm run compile)
src/              - TypeScript source code
syntaxes/         - Pascal TextMate grammar
snippets/         - Pascal code snippets
walkthrough/      - Extension walkthrough content
vscode-whats-new/ - Git submodule for "What's New" feature
package.json      - Extension manifest and npm scripts
README.md         - User documentation
CONTRIBUTING.md   - Development guide
```

### Build Outputs
- `npm run build` creates optimized bundles in `dist/`:
  - `extension-node.js` (~160 KB) - Desktop extension
  - `extension-web.js` (~122 KB) - Web extension
- `npm run compile` creates `.js` and `.js.map` files in `out/` directory




