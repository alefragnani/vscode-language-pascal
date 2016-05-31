@echo off

SET ASSEMBLE="C:\Program Files (x86)\Rice Lake Weighing Systems\Revolution\iRite Editor\Compilers\920Compiler\assemble.exe"
SET COMPILE="C:\Program Files (x86)\Rice Lake Weighing Systems\Revolution\iRite Editor\Compilers\920Compiler\compile.exe"
SET LANG="C:\Program Files (x86)\Rice Lake Weighing Systems\Revolution\iRite Editor\Compilers\920Compiler\lang.exe"

if /i %1%==test (
  SET PROJECT=test.src
) else (
  SET PROJECT=real.src
) 

call %ASSEMBLE% %PROJECT% "/t:Clean,Make" "/p:config=Debug" "/verbosity:minimal"
call %COMPILE% %PROJECT% "/t:Clean,Make" "/p:config=Debug" "/verbosity:minimal"

if %ERRORLEVEL% NEQ 0 GOTO END

echo. 
if /i %1%==test (
  TestProject\UnitTests.exe
)
:END