# Pascal Language Extension for VS Code

Always reference these instructions first and fallback to search or additional investigation only when you encounter unexpected information that does not match the information here.

This is a VS Code extension that provides Pascal language support including syntax highlighting, snippets, and code navigation features for Pascal, Delphi, and FreePascal.

## Working Effectively

### Prerequisites and Setup
- Install Node.js 16.x or higher
- Install Git 2.22.0 or higher
- Clone repository: `git clone https://github.com/alefragnani/vscode-language-pascal.git`
- Initialize submodules: `git submodule init && git submodule update` (required for vscode-whats-new dependency)
- Install dependencies: `npm install` -- takes ~15 seconds, installs 323 packages

### Build and Development Commands
**CRITICAL TIMING**: All build commands complete quickly (under 10 seconds). NEVER CANCEL these commands.

- `npm run build` -- builds extension with webpack in development mode. Takes ~3 seconds. Creates dist/ folder with bundled extension files.
- `npm run compile` -- compiles TypeScript source code. Takes ~2 seconds. Creates out/ folder.
- `npm run lint` -- runs ESLint on source code. Takes ~1 second. Currently shows 26 warnings but no errors - this is expected.
- `npm run watch` -- runs webpack in watch mode for development. Use this for iterative development.
- `npm run vscode:prepublish` -- builds extension in production mode (minified)
- `npm run webpack` -- alias for build command
- `npm run webpack-dev` -- alias for watch command

### Testing
**IMPORTANT**: Testing requires VS Code to be running and cannot be executed in headless environments.
- `npm test` -- runs full test suite including compilation, linting, and VS Code extension tests
- `npm run just-test` -- runs only the VS Code extension tests (requires VS Code)
- Tests are located in `src/test/suite/` and use Mocha framework

In headless environments, you can validate your changes with:
- `npm run compile` -- ensure TypeScript compiles without errors
- `npm run lint` -- ensure code style compliance  
- `npm run build` -- ensure webpack bundling succeeds

### Development Workflow
1. Run `npm run watch` to start development mode
2. Open VS Code and use "Launch Extension" debug configuration from `.vscode/launch.json`
3. Make changes to TypeScript files in `src/` 
4. Use "Reload Window" command in the Extension Development Host to test changes
5. Always run `npm run lint` before committing changes

### Recommended VS Code Extensions for Development
When developing this extension, install these helpful extensions:
- **ESLint** (dbaeumer.vscode-eslint) - for real-time linting feedback
- **TypeScript + Webpack Problem Matchers** - included in default VS Code

## Validation Scenarios
Since automated testing requires VS Code, always manually validate extension functionality:

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

### Code Navigation Testing (Optional)
Code navigation features require external tools that may not be available in all environments:
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

If these tools are not available, the extension will show informational messages but core functionality (syntax highlighting, snippets) will still work.

## Repository Structure

### Key Directories
- `src/` - TypeScript source code
  - `src/providers/` - Language feature providers (definition, references, symbols, tags)
  - `src/commands/` - Extension commands (file creation, tag generation)  
  - `src/test/` - Test suite
- `dist/` - Built extension files (webpack output)
- `out/` - Compiled TypeScript files  
- `syntaxes/` - TextMate grammar for Pascal syntax
- `snippets/` - Pascal code snippets
- `.vscode/` - VS Code workspace configuration
- `vscode-whats-new/` - Git submodule for "What's New" functionality

### Key Files
- `package.json` - Extension manifest with commands, configuration, and dependencies
- `webpack.config.js` - Webpack configuration for bundling
- `tsconfig.json` - TypeScript configuration
- `.github/workflows/main.yml` - CI pipeline that runs on Windows, Linux, and macOS

## Common Tasks and Outputs

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

### Extension Capabilities
- Syntax highlighting for .pas, .p, .dfm, .fmx, .dpr, .dpk, .lfm, .lpr, .ppr files
- Code snippets for Pascal constructs
- File creation commands (new Pascal file, class, interface, program) 
- Code navigation (when GNU Global tools are installed)
- Multi-root workspace support
- Localization support (English, Portuguese)

## Development Notes
- Extension supports both desktop VS Code and VS Code for Web
- Uses webpack for bundling with separate configurations for node and web targets
- Includes ESLint configuration with current 26 warnings (mostly unused variables)
- CI runs on Windows, Linux, and macOS with Node.js 16.x
- Extension requires trusted workspace for code navigation features
- Always test extension loading and basic functionality after making changes