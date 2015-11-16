# Pascal for Visual Studio Code
This extension adds support for the Pascal (Delphi/FreePascal/Lazarus) language to VS Code, including:

* Colorization
![syntax](images/vscode-pascal-syntax.png)

* Snippets
![snippets](images/vscode-pascal-snippets.png)


There is also **Task Examples**, which allows you to:

* Compile Delphi and FreePascal Projects:
* Navigate to _Errors/Warnings/Hints_, using the native _View / Errors and Warnings_ command

![compile](images/vscode-pascal-compile.png) 

## Using
Just install the extension and start using. It will automatically recognize all Pascal (Delphi/FreePascal/Lazarus) files. 

## Building Tasks
If you want to build tasks _(Task: Run Task Build)_ you can use the snippets below.

### Delphi
Update two tags:

* `DCC32.EXE_PATH`: The compiler location
* `YOUR_DELPHI_PROJECT.DPR`: The project being built.

```
    {
		"version": "0.1.0",
		"windows": {
			"command": "DCC32.EXE_PATH"
		},
		"isShellCommand": true,
		"showOutput": "always",
		"args": ["YOUR_DELPHI_PROJECT.DPR"],
		"problemMatcher": {
			"owner": "external",
			"pattern": {
				"regexp": "^([\\w]+\\.(pas|dpr|dpk))\\((\\d+)\\)\\s(Fatal|Error|Warning|Hint):(.*)",
				"file": 1,
				"line": 3,
				"message": 5
			}
		}
    }
```

### FreePascal

Update two tags:

* `FPC.EXE_PATH`: The compiler location
* `YOUR_FREEPASCAL_PROJECT`: The project being built.

```
    {
		"version": "0.1.0",
		"windows": {
			"command": "FPC.EXE_PATH"
		},
		"isShellCommand": true,
		"showOutput": "always",
		"args": ["YOUR_FREEPASCAL_PROJECT"],
		"problemMatcher": {
			"owner": "external",
			"pattern": {
				"regexp": "^([\\w]+\\.p)\\((\\d+)\\,(\\d+)\\)\\s(Fatal|Error|Warning|Note):(.*)",
				"file": 1,
				"line": 2,
				"column": 3,
				"message": 5
			}
		}
    }
```

## Compatibility
The plugin is primarily compatible to **Delphi** variant of **Pascal**, but **FreePascal/Lazarus** support is getting better.