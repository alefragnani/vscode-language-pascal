## Instalar GNU Global

Você deve instalar 4 ferramentas:

* GNU Global 6.5 ou mais recente (http://www.gnu.org/software/global/global.html) 
* Exuberant Tags 5.5 ou mais recente (http://ctags.sourceforge.net/)
* Python 2.7 ou mais recente (https://www.python.org/)
* Python Pygments (via `pip install Pygments`)

Atualizar a variável de ambiente `%PATH%` (_Systema_)

> Vamos dizer que você extraiu GNU Global e CTags na pasta `C:\gnu`. As duas novas entradas em `%PATH%` deveriam ser:
 
* GNU Global: `C:\gnu\glo653wb\bin`
* Excuberant Tags: `C:\gnu\ctags58\ctags58`

> Também tenha certeza que o Python está no `%PATH%`

Crie 2 novas variáveis de ambiente (_Systema_)

GNU Global usa CTags + Python Pygments como plugin, para conseguir reconhecer código fonte Pascal, então você precisa configurá-los.

* `GTAGSCONF`: `C:\gnu\glo653wb\share\gtags\gtags.conf` 
* `GTAGSLABEL`: `pygments`

![py-envvar](../images/vscode-pascal-py-envvar.png)