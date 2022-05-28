[![License](https://img.shields.io/static/v1?label=See&message=Readme&color=informational&style=for-the-badge)](../) [![License](https://img.shields.io/static/v1?label=See&message=Web%20Client&color=informational&style=for-the-badge)](../void-eye-games-client)

<style>
hr {width:100%;}
.center{width:100%;display:flex;align-items:center;justify-content:center;}
</style>

# Void Eye Game - Api
The API is the one that _provides data to the **web client**_ and *manage the session system*, see [Web Client](../void-eye-games-client) for more information.

## Requirements
Here you have the requiriments for **API side**:

### Health
Use to check the server state, whitch services are **UP** and witch are **DOWN**.
- [X] health requer support [GET]

### Sessions
- [X] Session control with **Auth Tokens**.
- [X] login request support [POST].
- [X] signin request support [POST].

### Data Management
- [X] Games
    - [X] Game request support to retrieve a specific game. [GET]
    - [X] Game request support to retrieve all games where X. [GET]
    - [X] Game request support to retrieve all games with minimized data. [GET]
    - [X] Game request to support the feature of adding games. [POST]
    - [X] Game request to support the feature of updating games. [POST]
- [X] Categories
    - [X] Category request support to retrieve a specific category. [GET]
    - [X] Category request support to retrieve all categories where X. [GET]
    - [X] Category request support to retrieve all categories with minimized data. [GET]
    - [X] Category request to support the feature of adding categories. [POST]
    - [X] Category request to support the feature of updating categories. [POST]
- [X] Plataforms
    - [X] Plataform request support to retrieve a specific plataform. [GET]
    - [X] Plataform request support to retrieve all plataforms where X. [GET]
    - [X] Plataform request support to retrieve all plataforms with minimized data. [GET]
    - [X] Plataform request to support the feature of adding plataforms. [POST]
    - [X] Plataform request to support the feature of updating plataforms. [POST]
- [X] Comments
    -  [X] Comments request to support the feature of adding comments to a game. [POST]

### Others
- [X] Email
    - [X] Email request to support the feature of send reports to the void eyes games support email. [POST]
    - [X] Email request to support the feature of recover password via email. [POST]

## User manual
In this *Users manual* you will see the API **usage** and a **description** *explaining features*.

### Health system
Sending a **GET** request to */* or */health* you will retrieve this as a response:
```JSON
{
    "status":"UP"
}
```
This **UP** means that the API is reachable on the net, and you can start requesting data.

#### URL Params
The *health* feature has some *optionals* URL Arguments, these are:
- **showComponents**: apart from *status* it also returns a components object, which indicates the current status of the services. (**Database service**, and **Atlas service**)
- **showLibraries**: apart from *status* it also returns a components object, which indicates the current status of the libraries. (**Logger library**, and **Mailer library**)
- **showDetails**: apart from *status* it also returns a details object, which indicates the current status of the details.

Here you have a example with all params in true:
```JSON
{
   "status":"UP",
   "components":{
      "service.database":{
         "status":"UP",
         "details":{
            "type":"mysql"
         }
      },
      "service.atlas":{ "status":"UP" },
      "library.logger":{ "status":"UP" },
      "library.mailer":{ "status":"UP" }
   },
   "details":{
      "table.users.count":5,
      "table.categories.count":14,
      "table.plataforms.count":12,
      "table.games.count":18,
      "table.games.limit-per-page":12
   }
}
```

<hr/>

### Session system
Used for **login/signin** action and for credetials check.<br/>
To prevent unidentified users from accessing certain services, a credentials object is required to identify you for said action, the middleware will check if said credentials are valid.

Here you have a example of a request that requires permissions:
```json
{
    "credentials": {
        "token": "77c0032ad3bccc14d129c75f2a8837e0", 
        "user": "JoseDuarte", 
        "expiration": 1653134799000,
        "accountType": 1
    },
    "data": {
        ...[your body post data]...
    }
}
```
If the **credentials** object is equals to the one saved in the API then the action will be done, otherwise it will return a **403 Not allowed** response.

#### Login and Singin
You can login sending a simple *username* and *password* to the `/login` url path.
```json
{
    "username": "username",
    "password": "password"
}
```

But for signin request, you have to send the followed JSON to the `/signin` url path:
```json
{
    "name": "<your name>",
    "password": "<your password encripted with MD5>",
    "confirmationPassword": "<your password encripted with MD5>",
    "email": "<your email>",
    "terms": true
}
```

<hr/>

### Data System
For each type of object **[games, categories, platforms and comments]** *similar requests* will be sent to their respective *directories*, in case of being about only 1 object, the directory will be in **singular**, in case of being about several, the directory will be in **plural**, for example:

For only 1 category, we will send the request to `/category`.
For more than one category, we will send the request to `/categories`.

##### Consults
In this way, to **consult** the data of a specific game (we will need the game id) the following request will be sent to `/game?id=<id>`, but if you want more than 1 game, you will send the request to `/games`, too if you need minimized data, you can request to `/games/listed`, in this way, the received data will be considerably lower. The same for the other **Object types**.

##### Inserts
To **add/insert** more objects of some type, send a **POST** request, with the object type data to the `/game` path.

##### Updates
If you want to **update** one object type, you will add the **singular object type path** plus `/update` path, so, for category update, you have to send the request to `/category/update`.

##### Deletes
In no case can _any of the objects created in the database be **deleted**_, since we like to have a record of what is happening in the market.

#### Special object type cases
As a special case, the following types have differences with respect to the previously mentioned.

##### Games
For the game object type, there is a difference in its way of querying more than 1 game _(the `/games` path)_, since this type has **URL Params** that the rest do not.

These **URL Params** are:
- **pageNum** is the page num that you are loading. (Number)
- **name** is used to search for specific game names. (String)
- **sort** can be one of the follows: name, price, plataform.
- **categories** are the categories ids of the searched games. (Array of Numbers)
- **plataforms** are the plataforms ids of the searched games. (Array of Numbers)

As you can see, the `/games` has a **pageNum** param, this is to allow paging of games, and **limit the size of the data** you can receive from a request, thus allowing for **faster speeds**.

##### Comments
For the comments object type, this type has only the insert method allowed, so you **<span style="color: red;">cant consult for one, more or minimized comments</span>** and you **<span style="color: red;">cant update this ones</span>**, only you can do is **<span style="color: green;">add</span>** comments.

#### Object types
This section is to show a **example of object type data** as **json object**

##### Games
```json
{
   "id":"1",
   "name":"[name]",
   "descripcion":"[description]",
   "medias":[ // list of images/videos of this game
      {
        "id":"1",
        "name":"image/png",
        "gamesId":"1",
        "mediaType":"image/png"
      }
   ],
   "plataforms_games":[ // Game to plataform relationship, with the prices and others
      {
         "plataformsId":"6",
         "gamesId":"1",
         "price":"12.40",
         "priceUnit":"USD",
         "discount":"0.00",
         "isEnabled":"1",
         "plataforms":{ // The plataform of this relation
            "id":"6",
            "name":"[Plataform name]",
            "url":"[Plataform url]"
         }
      }
   ],
   "categories":[ // categories of this game
      {
         "id":"1",
         "name":"Accion"
      }
   ],
   "comments":[ // comments about this game
      {
         "id":"1",
         "usersId":"2",
         "gamesId":"1",
         "description":"Un comentario de ejemplo",
         "users":{ // the user that comments the game
            "id":"2",
            "name":"Juan Alverto"
         }
      }
   ]
}
```

##### Categories
```json
{
   "id":"1",
   "name":"Accion",
   "games":[ // games in this category  (minimized)
      {
         "id":"1",
         "name":"[Game name]",
         "descripcion":"[Description]"
      }
   ]
}
```

##### Plataforms
```json
{
   "id":"1",
   "name":"[Plataform name]",
   "url":"https:/[Plataform domain]/",
   "plataforms_games":[// The games relationship selled for this plataform, with the price and details
      {
         "plataformsId":"1",
         "gamesId":"1",
         "price":"25.99",
         "priceUnit":"EUR",
         "discount":"0.00",
         "isEnabled":"1"
      }
   ],
   "games":[// The games selled for this plataform (minimized)
      {
         "id":"1",
         "name":"[Game name]",
         "descripcion":"[Description]"
      }
   ]
}
```

<hr/>

### Others
In this *Others* section, you can find the supports requests, like **password recovery** and **bug reports**.

#### Password recovery
To recovery a password, you will have to send a **POST** request to `/recovery`, The request must have the following format:
```json
{
    "data": {
        "email": "<Email associated with the account>"
    }
}
```
After you send the request, you will **receive an email with your new password**.

#### Bug report
To report a bug, you will have to send a **POST** request to `/report`, The request must have the following format:
```json
{
    "data": {
        "reason": "<The report reason, normally short, example: 'Account problems'>",
        "issue": "<A descriptibe title of your problem>",
        "description": "<A description of the problem>",
        "email": "<Your contact email>",
        "terms": true
    }
}
```

<hr/>

### Paths map
A map of all the paths in which you can make requests.
| Path                  | Methods       | Type      | Params                                                 |
|-----------------------|---------------|-----------|--------------------------------------------------------|
| `/`                   | GET           | Health    | none                                                   |
| `/health`             | GET           | Health    | none                                                   |
| `/login`              | POST          | Session   | none                                                   |
| `/signin`             | POST          | Session   | none                                                   |
| `/report`             | POST          | Others    | none                                                   |
| `/recovery`           | POST          | Others    | none                                                   |
| `/game`               | GET, POST     | Data Type | **Required**: {id}                                     |
| `/game/update`        | POST          | Data Type | none                                                   |
| `/games`              | GET           | Data Type | {pageNum}, {name}, {sort}, {categories}, {plataforms}  |
| `/games/listed`       | GET           | Data Type | none                                                   |
| `/category`           | GET, POST     | Data Type | **Required**: {id}                                     |
| `/category/update`    | POST          | Data Type | none                                                   |
| `/categories`         | GET           | Data Type | none                                                   |
| `/categories/listed`  | GET           | Data Type | none                                                   |
| `/plataform`          | GET, POST     | Data Type | **Required**: {id}                                     |
| `/plataform/update`   | POST          | Data Type | none                                                   |
| `/plataforms`         | GET           | Data Type | none                                                   |
| `/plataforms/listed`  | GET           | Data Type | none                                                   |
| `/comment`            | POST          | Data Type | none                                                   |
