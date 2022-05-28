# Installation
Download this repository and mount it on a web server, to give you an idea of ​​how the repository should be located, here would be the repository on a XAMPP server: `C:/xampp/htdocs/VoidEyeGames/`, leaving this file located (`INSTALLATION.md`) in the `VoidEyeGames` folder along with the rest of the files.

## Database
In your database, (in local) we proceed to the execution of the
following files in the order listed:
1. sql/SQLSentences.sql
2. sql/SQLMyUser.sql
3. sql/SQLInserts.sql
to check that everything went correctly, run `sql/SQLQueries.sql`.

## Dependencies
**IMPORTANT!! Have NodeJs and Composer installed**
We execute the following commands from the terminal being located in `C:/xampp/htdocs/VoidEyeGames/` execute the command `npm run install` or `npm run deploy`.

## Execution
### API
Run the **web** service and **database**, if when accessing `http://localhost/VoidEyeGames/void-eye-games-api/` you get this:
```json
{"status": "UP"}
```
Then the API was installed correctly.

### Client
Move from the terminal to the `C:/xampp/htdocs/VoidEyeGames/` directory and run `npm run start` command, when finished, then you can access from the browser to `localhost:8080/VoidEyeGames/`.

## Solucion de errores de la instalacion
If you find any error, comment it to me so we can fix it.