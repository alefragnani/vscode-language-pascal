## Install GNU Global

You have to install 4 tools:

* GNU Global 6.5 or higher (http://www.gnu.org/software/global/global.html) 
* Exuberant Tags 5.5 or higher (http://ctags.sourceforge.net/)
* Python 2.7 or higher (https://www.python.org/)
* Python Pygments (via `pip install Pygments`)

Update your `%PATH%` Environment Variable (_System_)

> Let's say you extract GNU Global and CTags in `C:\gnu` folder. The two new entries in `%PATH%` should be:
 
* GNU Global: `C:\gnu\glo653wb\bin`
* Excuberant Tags: `C:\gnu\ctags58\ctags58`

> Also make sure Python is in `%PATH%`

Create 2 new Environment Variables (_System_)

GNU Global uses CTags + Python Pygments as plugin in order to recognizes Pascal source code, so you have to configure them. 

* `GTAGSCONF`: `C:\gnu\glo653wb\share\gtags\gtags.conf` 
* `GTAGSLABEL`: `pygments`

![py-envvar](../images/vscode-pascal-py-envvar.png)