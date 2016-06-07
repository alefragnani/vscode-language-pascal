@echo on

SET IRITEPROC="C:\Users\brymul\Desktop\iRite_preprocessor.exe"

set pathName=%2%
set /p method=Enter The Comm Method:
set /p ip=Enter The IP:
set /p port=Enter The Port:

if /i %1%==TCP1280 (
  SET FILE=%pathName%
  call %IRITEPROC% %FILE% %method% %ip% %port%
) else (
  SET FILE=%pathName%
  call %IRITEPROC% %FILE% %method% %ip% %port%
) 

if %ERRORLEVEL% NEQ 0 GOTO END

echo. 
if /i %1%==test (
  TestProject\UnitTests.exe
)
:END