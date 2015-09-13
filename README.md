# Pascal language support in Visual Studio Code

Add support to Pascal language in Visual Studio Code.

### What is inside?

This repo contains the plugin for **Pascal** support in Visual Studio Code, which means:

* Syntax Highlighting
* Snippets

![screenshot](vscode-pascal-syntax.png)

There is also a **Task Example**, which allows you to:

* Compile Delphi Projects:
* Navigate to _Errors/Warnings/Hints_, using the native _View / Errors and Warnings_ command

![screenshot](vscode-pascal-compile.png)

### Unofficial Plugin

_This is a unofficial plugin, since the plugin support is not available in VSCode yet. I created it based on this [post](http://owensd.io/2015/05/21/swift-vscode.html)._

### How to use it

#### Syntax Highlighting

Simply download this repo and copy the **vs.language.pascal** folder inside your VSCode installation: `$ProgramFiles$\Microsoft VS Code\resources\app\plugins\`
	
#### Compilation

When you try to **Build** a Delphi Project _(Task: Run Task Build)_ it will offer you to configure a task runner. Accept it and use the `\task\task.json` code as your task, updating the references (compiler location and project name).

### Know Issues

* No syntax Highlighting for comments with `{` `}`

### TODO

* Update it to follow the guidelines when the oficial plugin support is available
* Support for FreePascal