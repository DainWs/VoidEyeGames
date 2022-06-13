# Void Eye Game
![License](https://img.shields.io/static/v1?label=License&message=ISC&color=green) ![License](https://img.shields.io/static/v1?label=Tags&message=1.2.0&color=yellow)

**Author:** Jose Antonio Duarte Perez<br/>
**Production:** To have access to the version in production, talk to Jose Antonio Duarte.

<span style="color:red;"> Before all, you should see the **Important** section below, you can easily differentiate it because the titles contains `Important!!`.</span>

## Description
Final project for 2ºDAW, its a website is intended for support in the search for the best offers and alternatives when buying video games. In addition, together with the detailed description of the video games that will be made through videos and images, you will find the different links to purchase websites and a series of comments written by users. They will also be able to report bugs to developers and view the location of our company on a map. In short, a page that helps customers to see on which page it is sold at the best price and the different prices at the time to buy video games. **Remember that games cannot be purchased on this page, since its purpose is consultation, and not the purchase of video games.**

### Documentation
[![USER MANUAL](https://img.shields.io/static/v1?label=PDF&message=Documentation&color=ED1C24&style=for-the-badge)](./docs/VoidEyeGames-Documentation.pdf)<br/>

### Apps documentation
We use API and the Web Client, you can find **Applications documentation** in the following links.

[![API](https://img.shields.io/static/v1?label=See&message=API&color=informational&style=for-the-badge)](void-eye-games-api) [![Web Client](https://img.shields.io/static/v1?label=See&message=Web%20Client&color=informational&style=for-the-badge)](void-eye-games-client)

## User manuals
You can see the full **Basic user manual** and recommended one:<br/>
[![USER MANUAL](https://img.shields.io/static/v1?label=See&message=Basic%20user%20manual&color=informational&style=for-the-badge)](./docs/manuals/BasicUserManual.md) [![USER MANUAL](https://img.shields.io/static/v1?label=PDF&message=Basic%20user%20manual&color=ED1C24&style=for-the-badge)](./docs/VoidEyeGames-Documentation.pdf)<br/>

We have user manuals for both the API and the Web Client:<br/> [![API](https://img.shields.io/static/v1?label=See&message=API&color=informational&style=for-the-badge)](void-eye-games-api) [![Web Client](https://img.shields.io/static/v1?label=See&message=Web%20Client&color=informational&style=for-the-badge)](void-eye-games-client)

## Style manual
You can see the styles manual here:
[![USER MANUAL](https://img.shields.io/static/v1?label=PDF&message=Style%20manual&color=ED1C24&style=for-the-badge)](./docs/StyleManual.pdf)

## Examples
You can see all features examples in the "BatteryExamples.md", clicking in the next link:
[![USER MANUAL](https://img.shields.io/static/v1?label=See&message=Battery%20examples&color=informational&style=for-the-badge)](./docs/BatteryExamples.md)

<hr/>

## Important!! - SSL Certs not included
As you can understand, I can't provide application passwords/credentials/certificates, as this could bring security issues, for this project you can only run it in DEVELOPMENT mode (using `npm start` command), Yes even if you want to be able to put it into production, access the `.crt` folder in the project root folder, (relative path from which this file is located is: `../.crt`, if the folder does not exist, no hesitate to create it) in that folder you will save the server.crt and the server.key (the certificates)
<hr/>


## Installation
For installation steps see the [INSTALLATION.md](INSTALLATION.md) or in the following link:

[![License](https://img.shields.io/static/v1?label=Review&message=Installation&color=orange&style=for-the-badge)](INSTALLATION.md)

## Goals
1. That the **users** can *compare the price of video games on each platform (including discounts)* and *select the one that sells it at the best price to buy*.
2. That the **users** can *consult the details in more depth about a game*, i mean, a *description*, a *series of images/videos/trailers* and *the opinion of the users* about the game.
3. That the **users** that is previously **logged in/registered**, can comment on their experience in the game.
4. If a **user** find **a wrong price/bug/error** on our page, whether *you are registered or not*, be able to *inform us* and *help us* **improve** the page, through an *error reporting form*.
5. That the **users** of our page can *find* their game as quickly as possible.

## Specifications
1. The application has an **API**, and can be accessed through a **Web Client**.
2. The **API** is made with **[PHP](https://www.php.net/)** (with **[Slim Framework](https://www.slimframework.com/)**).
3. The **Web Client** is made with **[NodeJS](https://nodejs.org/es/)** (with **[React](https://es.reactjs.org/)**).
4. The layout of the page is made with **[Bootstrap](https://getbootstrap.com/)** (and therefore **[Sass](https://sass-lang.com/)**) and with **[Fontawesome](https://fontawesome.com/)**.
5. Games are updated and added through the **Administrator user**, while that **logged in users** can *make comments* about their experience in the game.
6. Data **consultation and updating** is done **manually**, through pages only accessible by the **Administrator user**.

## Tools

![Visual Studio Code](https://img.shields.io/static/v1?label=IDE&message=Visual%20Studio%20Code&color=034987) ![Github](https://img.shields.io/static/v1?label=Version%20control&message=Github&color=24292f) ![Boostrap](https://img.shields.io/static/v1?label=Styles&message=Boostrap&color=4c0bce) ![Sass](https://img.shields.io/static/v1?label=Styles&message=Sass&color=ea7afb) ![Fontawesome](https://img.shields.io/static/v1?label=Styles&message=Fontawesome&color=74c0fc) ![NodeJS](https://img.shields.io/static/v1?label=Client%20Runtime%20Environment&message=NodeJS&color=039f00) ![Composer](https://img.shields.io/static/v1?label=API%20Runtime%20Environment&message=Composer&color=e77922) ![Client Framework](https://img.shields.io/static/v1?label=Client%20Framework&message=React&color=25dfca) ![API Framework](https://img.shields.io/static/v1?label=API%20Framework&message=Slim%20Framework&color=719E40) ![HTTP Request tester](https://img.shields.io/static/v1?label=HTTP%20Requests&message=Postman&color=f76935)
