@echo off

SET COMPILE="C:\Program Files (x86)\Rice Lake Weighing Systems\Revolution\iRite Editor\Compilers\1280Compiler\compile.exe"

if /i %1%==test (
  SET PROJECT=test.src
) else (
  SET PROJECT=real.src
) 

call %COMPILE% %PROJECT% "PATH HERE" "-v" TODO: THIS

if %ERRORLEVEL% NEQ 0 GOTO END

echo. 
if /i %1%==test (
  TestProject\UnitTests.exe
)
:END