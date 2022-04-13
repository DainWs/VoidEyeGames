@ECHO OFF

SET URL_BASE=localhost/VoidEyeGames/void-eye-games-api

setlocal
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set ESC=%%b
)

SET METHOD=GET
SET ACTION=/users
CALL :DO_TEST

SET ACTION=/users/id/1
CALL :DO_TEST

SET ACTION=/games
CALL :DO_TEST

SET ACTION=/games/id/1
CALL :DO_TEST

SET ACTION=/categories
CALL :DO_TEST

SET ACTION=/plataforms
CALL :DO_TEST

SET METHOD=POST
SET ACTION=/users/signIn
CALL :DO_TEST

SET ACTION=/users/logIn
CALL :DO_TEST

SET ACTION=/games
CALL :DO_TEST

SET ACTION=/games/categories
CALL :DO_TEST

SET ACTION=/categories/add
CALL :DO_TEST

SET ACTION=/categories/add/game
CALL :DO_TEST

SET ACTION=/plataforms/add
CALL :DO_TEST

SET ACTION=/plataforms/add/game
CALL :DO_TEST

SET ACTION=/plataforms/set/game
CALL :DO_TEST

SET ACTION=/comment
CALL :DO_TEST

SET ACTION=/report
CALL :DO_TEST

SET METHOD=PUT
SET ACTION=/games
CALL :DO_TEST

SET METHOD=DELETE
SET ACTION=/games/plataform
CALL :DO_TEST




PAUSE
EXIT
:DO_TEST
SET TEST=%ESC%[91mFAIL%ESC%[0m
curl -X %METHOD% http://%URL_BASE%%ACTION%  > nul 2>&1
if %ERRORLEVEL%==0 SET TEST=%ESC%[92mOK%ESC%[0m
echo [%TEST%] %METHOD% http://%URL_BASE%%ACTION%
exit /B 0