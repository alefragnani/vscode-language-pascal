# Pascal for Visual Studio Code

This extension adds support for the Pascal Language to Visual Studio Code. It works with Delphi and FreePascal/Lazarus and supports:

* Colorization
* Snippets
* Format Code
* Task Build
* Code Navigation
	* Go to Symbol
	* Go to Definition
	* Peek Definition
	* Find All References

# Installation

Press `F1` in VSCode, type `ext install` and then look for `Language Pascal`.

# Usage

## Colorization

Full syntax highlight for Pascal

![syntax](images/vscode-pascal-syntax.png)

## Snippets

Almost 40 snippets available:

![snippets](images/vscode-pascal-snippets.png)

## Format Code

Standardise your Pascal code! The extension uses external tools _(engines)_ to format the code, so you must install them prior to use the `Format Document` and `Format Selection` commands.

* **Jedi Code Format:** http://jedicodeformat.sourceforge.net/ (Windows only)
* **FreePascal PToP:** http://wiki.freepascal.org/PTop (Windows, Linux and Mac OS X)

> If you intend to format _pieces of selected texts_ instead of _the entire file_, you should use **FreePascal PToP**, because the **Jedi Code Format** only works for entire files. 

### Available settings

* Choose the engine to be used _(required)_
```
    // ptop means FreePascal PToP
    "pascal.formatter.engine": "ptop"
    
    // jcf means Jedi Code Format 
    "pascal.formatter.engine": "jcf"
```

* Indicates the engine app path _(required)_
```
    "pascal.formatter.enginePath": "C:\\FPC\\2.6.4\\bin\\i386-win32\\ptop.exe" 
```

* Indicates the configuration file for the selected engine _(optional)_
```
    "pascal.formatter.engineParameters": "C:\\FPC\\2.6.4\\bin\\i386-win32\\default.cfg"
```

## Code Navigation

> _new in version 0.7.0_  

* Go to Symbol
* Go to Definition
* Peek Definition
* Find All References

Navigate to any language element (methods, attributes, classes, interfaces, and so on) inside Pascal files.

> It uses GNU Global, a source code tagging system, which means that it has some limitations if you compare with an AST parsing.

#### Installing and Configuring GNU Global

1. You have to install 4 tools:

 * GNU GLobal 6.5 or higher (http://www.gnu.org/software/global/global.html) 
 * Exuberant Tags 5.5 or higher (http://ctags.sourceforge.net/)
 * Python 2.7 or higher (https://www.python.org/)
 * Python Pygments (via `pip install Pygments`)

2. Update your `%PATH%` Environment Variable (_System_)

 Let's say you extract GNU Global and CTags in `C:\gnu` folder. The two new entries in `%PATH%` should be:
 
 * GNU Global: `C:\gnu\glo653wb\bin`
 * Excuberant Tags: `C:\gnu\ctags58\ctags58`

 Also make sure Python is in `%PATH%`

3. Create 2 new Environment Variables (_System_)

 GNU Global uses CTags + Python Pygments as plugin in order to recognizes Pascal source code, so you have to configure them. 
 
 * `GTAGSCONF`: `C:\gnu\glo653wb\share\gtags\gtags.conf` 
 * `GTAGSLABEL`: `pygments`

![py-envvar](images/vscode-pascal-py-envvar.png)
 
> **NOTE:** For now, it was tested only on Windows, but since these tools are multiplatform (in fact, it comes from Unix), it should work on Linux and Mac. 

# Available commands

## Code Formatter

The extension seamlessly integrates with the `Format Document` and `Format Selection` commands **Visual Studio Code**.

![format-code](images/vscode-pascal-format-code.gif)

There is also:

* **Pascal: Edit Formatter Parameters** Opens/Generate the _parameters file_ for the selected engine

## Code Navigation

To enable **Code Navigation**, the extension depends on **GNU Global and Exuberant Tags** and for that, you must run `gtags` on the Root folder, so the tags are created. In order to make your life easier, two commands where added:

* **Pascal: Generate/Reset Tags**: Use this to _create_ or _reset_ the tags in the current project. You just have to do it once. 
* **Pascal: Update Tags**: Use this to _update_ the tags for current project. You should use this command to _update the references_ when any source code is updated.

# Task Build

Use this **Task Examples**, so you can:

* Compile Delphi and FreePascal Projects:
* Navigate to _Errors/Warnings/Hints_, using the native _View / Errors and Warnings_ command

![compile](images/vscode-pascal-compile.png) 

### Building Tasks

If you want to build tasks _(Task: Run Task Build)_ you can use the snippets below.

#### Delphi

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

#### FreePascal

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

# Changelog

## Version 0.7.0

* **New** Go to Definition
* **New** Peek Definition
* **New** Find All References

## Version 0.6.0

* **New** Added _Formatters_ category for Marketplace (kudos to @waderyan)

## Version 0.5.0

* **New** Updated Syntax definitions (basic types, hexadecimal values, operators, flow control and others)

## Version 0.4.1

* **Fix:** Toggle Line/Block Comment not working (issue [#8](https://github.com/alefragnani/vscode-language-pascal/issues/8))

## Version 0.4.0

* **New:** Go to Symbol

## Version 0.3.1

* **Fix:** Formatter settings not available (issue [#1](https://github.com/alefragnani/vscode-language-pascal/issues/1))

## Version 0.3.0

* **New:** Formatter added

## Version 0.2.0

* License updated

## Version 0.1.1

* Icon added for Marketplace

## Version 0.1.0

* Update to official guidelines

## Version 0.0.1

* Initial release

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani

---

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) if you enjoy using this extension :-)