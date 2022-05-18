# Void Eye Game
**Author:** Jose Antonio Duarte Perez

## Installation
Descargate la rama `Responsive-Plan`, y en un servidor web, colocas los archivos, por ejemplo, la ruta de los archivos en xampp estaria en: `C:/xampp/htdocs/VoidEyeGames/`, en esta rama es importante mantener esta ruta, 

### Database
En tu base de datos, (en local) procedemos a la ejecución de los 
siguientes archivos en el orden indicado:
- sql/SQLSentences.sql
- sql/SQLMyUser.sql
- sql/SQLInserts.sql
para comprobar que todo fue correctamente, ejecute `sql/SQLQueries.sql`.

### Dependencias
**¡¡IMPORTANTE!! Tener instalado NodeJs y Composer**
Ejecutamos la siguiente secuencia de comandos desde la terminal estando situados en `C:/xampp/htdocs/VoidEyeGames/`:
- npm install
- cd void-eye-games-api
- composer install
- cd ../void-eye-games-client
- npm install

### Ejecución
#### API
Ejecuta el servicio web y de base de datos, si al acceder a `http://localhost/VoidEyeGames/void-eye-games-api/` te salta un `Method not allowed` se instalo correctamente la API del proyecto.

#### Client
Muevase desde la terminal al directorio `C:/xampp/htdocs/VoidEyeGames/void-eye-games-client/` y ejecute `npm run web` y cuando acabe de cargar, y salgan algunas opciones, pulsa **R** en el teclado (la opcion de refresh), a continuacion se abrira una pagina web. (el usuario administrador de la web es 'admin' y password 'prueba').

### Solucion de errores de la instalacion
Si encuentra algun error, comentelo para poder solucionarlo.