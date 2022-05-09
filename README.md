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

__¡¡¡Importante!!! los requisitos marcados los puedes encontrar en la rama `Responsive-Plan`__

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
    - [X] Add games.
    - [ ] Add categories to game. **(need to be checked one last time)**
    - [ ] Add images to game. **(need to be checked one last time)**
    - [ ] Edit Games **(need to be checked one last time)**
- [ ] **Admin** Plataform Form View
    - [X] Add Plataforms.
    - [ ] Add games to plataform with prices and discount of the plataform. **(need to be checked one last time)**
    - [ ] Edit plataforms **(need to be checked one last time)**
- [X] **Admin** Categories Form View
    - [X] Add category.
    - [X] Add games to category.
    - [ ] Edit categories **(need to be checked one last time)**

## TO FIX
- [ ] Cuando clicas en cualquier boton te hace un window.toTop

- [ ] Compatibilidad entre web y android
    - [ ] Css/Stylesheets/Sass/Scss files not allowed in react native
    - [ ] JQuery not allowed, because react-native has their own DOM-Like native system.
    - [ ] LocalStorage not allowed, we have to use a community package (most are abandoned) to do a correct implementation of AsyncStorage.
    - [ ] Errors finded packaging Android/IOS app, Conversion of some React components are not possible to do.
    - [ ] AsyncStorage (the localstorage alternative for React-Native) is not supported in most versions of the web.
