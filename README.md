# iRite for Visual Studio Code

This extension adds support for the iRite Language to Visual Studio Code. It supports:

* Colorization
* Snippets
* Preprocessing
* External compiler

# Installation

Press `F1` in VSCode, delete carrot, and type `ext install` and then look for `Language iRite`.

# Usage

## Colorization

Full syntax highlight for iRite

![syntax](images/vscode-irite-syntax.png)

## Snippets

Almost 40 snippets available:

![snippets](images/vscode-irite-snippets.png)

## Preprocessor/Compilation/Deployment

Add this as your tasks.json:

{
    "version": "0.1.0",
    "command": "C:/(exe path)/iRite_preprocessor.exe",
    "args": ["${fileDirname}/${fileBasename}", "${fileDirname}"],
    "isShellCommand": false,
    "isBuildCommand": true,
    "showOutput": "always",
    "problemMatcher": {
        "owner": "cpp",
        "fileLocation": ["relative", "${workspaceRoot}"],
        "pattern": {
                    "regexp": "((([A-Za-z]):\\\\(?:[^\\/:*?\\\"<>|\\r\\n]+\\\\)*)?[^\\/\\s\\(:*?\\\"<>|\\r\\n]*)\\((\\d+)\\):\\s.*(fatal|error|warning|hint)\\s(.*):\\s(.*)",
                    "file": 1, 
                    "line": 4,
                    "severity": 5,
                    "code": 6,
                    "message": 7
                }
    }
}

