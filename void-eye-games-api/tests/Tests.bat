@ECHO OFF

SET URL_BASE=localhost/VoidEyeGames/void-eye-games-api

setlocal
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set ESC=%%b
)

SET METHOD=GET
SET ACTION=/health
CALL :DO_TEST

SET ACTION=/games
CALL :DO_TEST

SET ACTION=/game?id=1
CALL :DO_TEST

SET ACTION=/categories
CALL :DO_TEST

SET ACTION=/category?id=1
CALL :DO_TEST

SET ACTION=/plataforms
CALL :DO_TEST

SET ACTION=/plataform?id=1
CALL :DO_TEST

PAUSE
EXIT
:DO_TEST
SET TEST=%ESC%[91mFAIL%ESC%[0m
curl -X %METHOD% http://%URL_BASE%%ACTION%  > nul 2>&1
if %ERRORLEVEL%==0 SET TEST=%ESC%[92mOK%ESC%[0m
echo [%TEST%] %METHOD% http://%URL_BASE%%ACTION%
exit /B 0