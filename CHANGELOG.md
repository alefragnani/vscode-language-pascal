## [9.7.0] - 2024-02-03
### Added
* Missing keywords from FreePascal and Oxygene (thanks to @TheWitheredStriker [PR #138](https://github.com/alefragnani/vscode-language-pascal/pull/138))

### Fixed
* Comment auto closing pairs (issue [#141](https://github.com/alefragnani/vscode-language-pascal/issues/141))

### Internal
* Security Alert: word-wrap (PR [#139](https://github.com/alefragnani/vscode-language-pascal/pull/139))
* Security Alert: webpack (PR [#130](https://github.com/alefragnani/vscode-language-pascal/pull/130))

## [9.6.0] - 2023-02-14
### Internal
* Support Implicit Activation Events (issue [#126](https://github.com/alefragnani/vscode-language-pascal/issues/126))
* Support **Translation** and **Localization** APIs (issue [#122](https://github.com/alefragnani/vscode-language-pascal/issues/122))
* Update badges in README (issue [#128](https://github.com/alefragnani/vscode-language-pascal/issues/128))
* Improve Extension Startup (issue [#111](https://github.com/alefragnani/vscode-language-pascal/issues/111))
* Package cleanup (issue [#110](https://github.com/alefragnani/vscode-language-pascal/issues/110))
* Security Alert: minimatch (PR [#124](https://github.com/alefragnani/vscode-language-pascal/pull/124))
* Security Alert: terser (PR [#112](https://github.com/alefragnani/vscode-language-pascal/pull/112))

## [9.5.1] - 2022-07-17
### Internal
* Add GitHub Sponsors support (PR [#108](https://github.com/alefragnani/vscode-language-pascal/pull/108))

## [9.5.0] - 2022-03-28
### Added
* Web Support (issue [#89](https://github.com/alefragnani/vscode-language-pascal/issues/89))
* Getting Started/Walkthrough (issue [#84](https://github.com/alefragnani/vscode-language-pascal/issues/84))
* Update Keywords (issue [#102](https://github.com/alefragnani/vscode-language-pascal/issues/102))

## [9.4.0] - 2021-12-10
### Internal
* Add CONTRIBUTING documentation (issue [#95](https://github.com/alefragnani/vscode-language-pascal/issues/95))
* Update dependencies (issue [#98](https://github.com/alefragnani/vscode-language-pascal/issues/98))

## [9.3.0] - 2021-06-01
### Added
- Support **Workspace Trust** (issue [#80](https://github.com/alefragnani/vscode-language-pascal/issues/80))
- Support **Virtual Workspaces** (issue [#79](https://github.com/alefragnani/vscode-language-pascal/issues/79))

### Internal
- Security Alert: lodash (dependabot [PR #78](https://github.com/alefragnani/vscode-language-pascal/pull/78))

## [9.2.0] - 2020-10-01
### Internal
- Reopen providers repo (issue [#67](https://github.com/alefragnani/vscode-language-pascal/issues/67))

### Fixed
- `Find References` command not working (issue [#68](https://github.com/alefragnani/vscode-language-pascal/issues/68))

## [9.1.0] - 2020-08-05
### Internal
- Support Extension View Context Menu (issue [#56](https://github.com/alefragnani/vscode-language-pascal/issues/56))
- Migrate from TSLint to ESLint  (issue [#63](https://github.com/alefragnani/vscode-language-pascal/issues/63))

### Fixed
- Security Alert: elliptic (dependabot [PR #64](https://github.com/alefragnani/vscode-language-pascal/pull/64))
- Security Alert: acorn (dependabot [PR #58](https://github.com/alefragnani/vscode-language-pascal/pull/58))

## [9.0.0] - 2020-02-14
### Changed
- Task samples upgraded to v2 (thanks to @Creativelaides [PR #54](https://github.com/alefragnani/vscode-language-pascal/pull/54))

### Internal
- Support VS Code package split

## [8.0.3] - 2019-11-19
### Fixed
- Close parentheses missing for function and procedure snippets (thanks to @SpaceEEC [PR #51](https://github.com/alefragnani/vscode-language-pascal/pull/51))
- Security Alert: mixin-deep (thanks to @dependabot ;-) [PR #53](https://github.com/alefragnani/vscode-language-pascal/pull/53))
- Security Alert: diff

## [8.0.1] - 2019-05-28
### Fixed
- Security Alert: tar

## [8.0.1] - 2019-03-13
### Fixed
- What's New page broken in VS Code 1.32 due to CSS API changes

## [8.0.0] - 2019-02-13
### Added
- Use new VSCode API - Open Resource in Browser (issue [#46](https://github.com/alefragnani/vscode-language-pascal/issues/46))

### Changed
- Update grammar based on Monaco Language PR (issue [#43](https://github.com/alefragnani/vscode-language-pascal/issues/43))

### Fixed
- Final cursor position on some Snippets (issue [#41](https://github.com/alefragnani/vscode-language-pascal/issues/41))

## [7.1.2] - 2019-01-05
### Fixed
- Remove remaining format settings (now on Formatter) (issue [#40](https://github.com/alefragnani/vscode-language-pascal/issues/40))

## [7.1.1] - 2018-12-20
### Fixed
- Missing **Pascal Formatter** as dependent extension

## [7.1.0] - 2018-12-20
### Changed
- The **Formatter** was extracted to its own extension ([Pascal Formatter](https://github.com/alefragnani/vscode-pascal-formatter))

## [7.0.0] - 2018-12-01
### Added
- What's New

## [6.4.0] - 2018-09-14
### Added
- Patreon button

## [6.3.0] - 2018-07-28
### Added
- New Project Name (now just **_Pascal_**)
- Improve code navigation (issue [#32](https://github.com/alefragnani/vscode-language-pascal/issues/32))
- New Publishing Model

## [0.12.0 - 6.2.0] - 2018-07-14
### Added
- Support `.lpr` files (thanks to @BeRo1985 [PR #30](https://github.com/alefragnani/vscode-language-pascal/pull/30))
- New Version Numbering based on `semver`

## [0.11.0 - 6.1.0] - 2018-04-17
### Added
- Visual Studio Live Share support (thanks to @lostintangent [PR #28](https://github.com/alefragnani/vscode-language-pascal/pull/28))

## [0.10.0 - 6.0.0] - 2017-10-26
### Added
- Multi-root support (issue [#26](https://github.com/alefragnani/vscode-language-pascal/issues/26))

## [0.9.1 - 5.1.1] - 2017-09-17
### Fixed
- Better description for `pascal.tags.autoGenerate` setting

## [0.9.0 - 5.1.0] - 2017-09-16
### Added
- Auto generate tags for Code Navigation (issue [#17](https://github.com/alefragnani/vscode-language-pascal/issues/17))

## [0.8.2 - 5.0.0] - 2017-07-03
### Fixed
- Better handling if _`global` is not available_, with a _Don't show again_ option (issue [#21](https://github.com/alefragnani/vscode-language-pascal/issues/21))

### Changed
- **TypeScript** and **VS Code engine** updated

## [0.8.1 - 4.1.1] - 2017-07-01
### Fixed
- `$REGION` snippet not working because `$` sign (Thanks to @idleberg [PR #22](https://github.com/alefragnani/vscode-language-pascal/pull/22))

## [0.8.0 - 4.1.0] - 2017-02-14
### Changed
- Grammar updated to support VSCode 1.9.0

## [0.7.0 - 4.0.0] - 2016-11-27
### Added
- Support `Go to Definition` command
- Support `Peek Definition` command
- Support `Find All References` command
* New Command: `Pascal: Generate Tags`
* New Command: `Pascal: Update Tags`

## [0.6.0 - 3.1.0] - 2016-10-27
### Added
- Added _Formatters_ category for Marketplace (thanks to @waderyan)

## [0.5.0 - 3.0.0] - 2016-08-20
### Added
- Updated Syntax definitions (basic types, hexadecimal values, operators, flow control and others)

## [0.4.1 - 2.0.1] - 2016-07-21
### Fixed
- Toggle Line/Block Comment not working (issue [#8](https://github.com/alefragnani/vscode-language-pascal/issues/8))

## [0.4.0 - 2.0.0] - 2016-05-29
### Added
- Support `Go to Symbol` command

## [0.3.1 - 1.2.1] - 2016-04-12
### Fixed
- Formatter settings not available (issue [#1](https://github.com/alefragnani/vscode-language-pascal/issues/1))

## [0.3.0 - 1.2.0] - 2016-04-10
### Added
- Formatter support

## [0.2.0 - 1.1.0] - 2016-01-16
### Added
* License updated

## [0.1.1 - 1.0.1] - 2015-11-17
### Fixed
- Icon added for Marketplace

## [0.1.0 - 1.0.0] - 2016-11-16
### Added
- Update to official guidelines

## [0.0.1 - 0.9.0] - 2015-10-13
- Initial release
