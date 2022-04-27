USE void_eye_games;

INSERT INTO CATEGORIES VALUES (null, "Accion");
INSERT INTO CATEGORIES VALUES (null, "Un jugador");
INSERT INTO CATEGORIES VALUES (null, "Multijugador");
INSERT INTO CATEGORIES VALUES (null, "Supervivencia");
INSERT INTO CATEGORIES VALUES (null, "RPG");

INSERT INTO PLATAFORMS VALUES (null, "Microsoft", "https://www.xbox.com/es-es/promotions/sales/spring-sale");
INSERT INTO PLATAFORMS VALUES (null, "Steam", "https://store.steampowered.com/?l=spanish");
INSERT INTO PLATAFORMS VALUES (null, "Gamivo", "https://www.gamivo.com/");
INSERT INTO PLATAFORMS VALUES (null, "Epic games", "https://www.epicgames.com/site/es-ES/home");
INSERT INTO PLATAFORMS VALUES (null, "Instant gaming", "https://www.instant-gaming.com/es/");

INSERT INTO USERS VALUES (null, "admin", "21232f297a57a5a743894a0e4a801fc3", "void.eye.games@gmail.com", null, 0, 'Admin');

INSERT INTO GAMES VALUES (null, "Minecraft", "What is it? Minecraft is a video game in which players create and break apart various kinds of blocks in three-dimensional worlds. The game’s two main modes are Survival and Creative. In Survival, players must find their own building supplies and food. They also interact with blocklike mobs, or moving creatures. (Creepers and zombies are some of the dangerous ones.) In Creative, players are given supplies and do not have to eat to survive. They also can break all kinds of blocks immediately.<br/>Are there points or levels? No. The purpose of the game is simply to build and explore (and survive).<br/>How many players can play it? You can play by yourself or you can play online with others. The smartphone and tablet versions offer multi-player options through WiFi networks. Players can connect to thousands of Minecraft online games (servers), some of which involve battling other players.<br/>Which devices can I play it on? There are versions for PCs, Macs and Xbox 360. There’s also a version for iPhone, iPad, Kindle Fire and Android smartphones.");

INSERT INTO COMMENTS VALUES (null, 1, 1, "Un comentario de ejemplo");

INSERT INTO MEDIAS VALUES (null, 1, "image/png");
INSERT INTO MEDIAS VALUES (null, 1, "video/mp4");

INSERT INTO categories_games VALUES (1, 1);
INSERT INTO categories_games VALUES (2, 1);
INSERT INTO categories_games VALUES (3, 1);
INSERT INTO categories_games VALUES (4, 1);

INSERT INTO plataforms_games VALUES (1, 1, 25.99, 'EURO', 0.0, 1);
INSERT INTO plataforms_games VALUES (3, 1, 15.99, 'EURO', 0.0, 1);