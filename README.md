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

## Description
Final project for 2ºDAW, its a website is intended for support in the search for the best offers and alternatives when buying video games. In addition, together with the detailed description of the video games that will be made through videos and images, you will find the different links to purchase websites and a series of comments written by users. They will also be able to report bugs to developers and view the location of our company on a map. In short, a page that helps customers to see on which page it is sold at the best price and the different prices at the time to buy video games.

## Requirements
### Views
- [X] Home View
    - [X] Slider
    - [X] News
- [X] Games View
    - [X] Order By {Name, Price, Plataform}
    - [X] Categories Filtre
    - [X] Plataforms Filtre
- [X] Games Details View
    - [X] Galery
    - [X] Best plataforms to buy
    - [X] A description
    - [X] User comments
        - [X] Logged user can add Comments
- [X] Support View
    - [X] GeoLocation
    - [X] Report form navigation button
- [X] Report Form View
- [X] Login Form View
    - [ ] [Optional] Recovery password
- [X] Signin Form View

- [X] **Admin** Game Form View
    - [X] A list of games to select which one do you want to edit
    - [X] Add games.
    - [X] Add categories to game.
    - [X] Add images to game.
    - [X] Edit Games
- [X] **Admin** Plataform Form View
    - [X] A list of Plataforms to select which one do you want to edit
    - [X] Add Plataforms.
    - [X] Add games to plataform with prices and discount of the plataform.
    - [X] Edit plataforms
- [X] **Admin** Categories Form View
    - [X] A list of categories to select which one do you want to edit
    - [X] Add category.
    - [X] Add games to category.
    - [X] Edit categories

- [ ] Poner la app en producción.


# fix
- [X] Ha dejado de mostrarse la imagen principal en el formulario de juegos.
- [X] El texto de la lista de medias sobresale, ponerle un overflow.
- [X] El boton de eliminar media no parece funcionar.
- [X] La descripcion se borra cuando se añade el juego a una categoria

    - [ ] Al añadir un juego a una plataforma, deberia habilitarse solo.

- [ ] Hay problemas con la edicion de juegos, y tal vez con la insercion de los mismos

- [ ] Es posible que haya que checkear otra vez la seccion de admin.