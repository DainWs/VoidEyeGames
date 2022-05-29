USE void_eye_games;

DELETE FROM plataforms_games;
DELETE FROM categories_games;
DELETE FROM MEDIAS;
DELETE FROM COMMENTS;
DELETE FROM GAMES;
DELETE FROM USERS;
DELETE FROM PLATAFORMS;
DELETE FROM CATEGORIES;

INSERT INTO CATEGORIES VALUES (null, "Accion");
INSERT INTO CATEGORIES VALUES (null, "Un jugador");
INSERT INTO CATEGORIES VALUES (null, "Multijugador");
INSERT INTO CATEGORIES VALUES (null, "Supervivencia");
INSERT INTO CATEGORIES VALUES (null, "RPG");
INSERT INTO CATEGORIES VALUES (null, "Coches");
INSERT INTO CATEGORIES VALUES (null, "Shooter");
INSERT INTO CATEGORIES VALUES (null, "Rol");
COMMIT;

INSERT INTO PLATAFORMS VALUES (null, "Microsoft", "https://www.xbox.com/es-es/promotions/sales/spring-sale");
INSERT INTO PLATAFORMS VALUES (null, "Steam", "https://store.steampowered.com/?l=spanish");
INSERT INTO PLATAFORMS VALUES (null, "Gamivo", "https://www.gamivo.com/");
INSERT INTO PLATAFORMS VALUES (null, "Epic games", "https://www.epicgames.com/site/es-ES/home");
INSERT INTO PLATAFORMS VALUES (null, "Instant gaming", "https://www.instant-gaming.com/es/");
INSERT INTO PLATAFORMS VALUES (null, "Riot Games", "https://www.riotgames.com/es");
COMMIT;

/* The password is 'prueba' */
INSERT INTO USERS VALUES (null, "admin", "c893bad68927b457dbed39460e6afd62", "void.eye.games@gmail.com", 'logo.png', 0, 0);
INSERT INTO USERS VALUES (null, "Juan Alverto", "c893bad68927b457dbed39460e6afd62", "Juan@void.eye.games.com", null, 1, 1);
INSERT INTO USERS VALUES (null, "Pepito Golosinas", "c893bad68927b457dbed39460e6afd62", "PepitoGolosinas@void.eye.games.com", null, 0, 1);
INSERT INTO USERS VALUES (null, "MªCarmen", "c893bad68927b457dbed39460e6afd62", "MCarmen@void.eye.games.com", null, 1, 1);
INSERT INTO USERS VALUES (null, "Lucia", "c893bad68927b457dbed39460e6afd62", "Lucia@void.eye.games.com", null, 0, 1);
COMMIT;

INSERT INTO GAMES VALUES (null, "Minecraft", "What is it? Minecraft is a video game in which players create and break apart various kinds of blocks in three-dimensional worlds. The game’s two main modes are Survival and Creative. In Survival, players must find their own building supplies and food. They also interact with blocklike mobs, or moving creatures. (Creepers and zombies are some of the dangerous ones.) In Creative, players are given supplies and do not have to eat to survive. They also can break all kinds of blocks immediately.\nAre there points or levels? No. The purpose of the game is simply to build and explore (and survive).\nHow many players can play it? You can play by yourself or you can play online with others. The smartphone and tablet versions offer multi-player options through WiFi networks. Players can connect to thousands of Minecraft online games (servers), some of which involve battling other players.\nWhich devices can I play it on? There are versions for PCs, Macs and Xbox 360. There’s also a version for iPhone, iPad, Kindle Fire and Android smartphones.");
INSERT INTO GAMES VALUES (null, "GTA V", "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves involved with the worst and most insane of the criminal underworld, the US government and the entertainment industry, they must pull off a series of dangerous hits to survive in an unforgiving city where no one can be trusted. And much less in each other.\n\nGrand Theft Auto V for PC gives gamers the option to explore the award-winning world of Los Santos and Blaine County in 4K resolution and enjoy gameplay at 60 frames per second.\n\nThe game features multiple and varied PC-specific customization options, with over 25 different configurable settings for texture quality, shader, tessellation, anti-aliasing, and many other items, as well as mouse and keyboard customization options. It is also possible to modify the population density to control vehicle and pedestrian traffic, and it is compatible with two and three monitors, 3D and plug-and-play controllers.\n\nGrand Theft Auto V for PC also includes Grand Theft Auto Online, supporting 30 players and two spectators. Grand Theft Auto Online for PC will include all Rockstar-created enhancements and content since the launch date of Grand Theft Auto Online, including Heists and Adversary Modes.\n\nThe PC version of Grand Theft Auto V and Grand Theft Auto Online features First Person View, giving players the ability to explore every detail of the world of Los Santos and Blaine County in a whole new way.\n\nGrand Theft Auto V for PC also features the new Rockstar Editor, a set of tools that make it quick and easy to record, edit and share videos from Grand Theft Auto V and Grand Theft Auto Online. Thanks to the Rockstar Editor's director mode, players can bring their ideas to life and create scenes with in-game characters, pedestrians and even animals. The editor has advanced camera movement techniques, editing effects such as slow or fast motion images, various camera filters, the ability to add songs from GTA V radio stations or dynamically control the intensity of the music of the game. Finished videos can be uploaded directly to YouTube and the Rockstar Games Social Club from within the Rockstar Editor for easy sharing.\n\nThe Alchemist and Oh No, composers of the soundtrack, are the announcers of the new in-game radio, 'The Lab FM', which broadcasts new and exclusive songs from these two artists inspired by the original music of the game. Other guest artists like Earl Sweatshirt, Freddie Gibbs, Little Dragon, Killer Mike and Sam Herring of Future Islands, to name a few, also collaborate. Players can also discover Los Santos and Blaine County while listening to their own music on 'Your Radio,' a new station with a player-created and personalized soundtrack.");
INSERT INTO GAMES VALUES (null, "Rocket League", "Rocket League is a fantastical sport-based video game, developed by Psyonix (it's “soccer with cars”). It features a competitive game mode based on teamwork and outmaneuvering opponents. Players work with their team to advance the ball down the field, and score goals in their opponents' net.");
INSERT INTO GAMES VALUES (null, "League of legends", "League of Legends is a team strategy game in which two teams of five champions face off to see who destroys the other's base first. Choose from a roster of 140 champions to pull off epic plays, assassinate opponents, and take down turrets to claim victory.");
INSERT INTO GAMES VALUES (null, "V Rising", "Wake up as a vampire weakened after centuries of slumber. Go hunting for blood to regain your strength, while hiding from the scorching sunlight. Rebuild your castle and transform humans into your loyal servants on a quest to achieve your vampire empire. Make allies or enemies playing online or play alone, challenging holy soldiers and battling in the war of a world plunged into conflict.\n\nWill you be the one to rise as the next Dracula?.");
INSERT INTO GAMES VALUES (null, "Among Us", "Among Us is a game very similar to the classic 'The Assassin' that we have played once on cards, but brought to the world of video games. You are in a spaceship, and two imposters who are 'among us', hence the title, have to kill the other eight crew members before they discover them.");
INSERT INTO GAMES VALUES (null, "Valorant", "Valorant is a first-person shooter where two teams of five players face off against each other. In addition to the usual shots, the objective of the games is to place a device called Spike in a specific area of ​​the map.");
INSERT INTO GAMES VALUES (null, "Evolve Stage 2", "Evolve Stage 2 is Now Free to Play on Steam!\n\nEvolve Stage 2 is a next-generation free multiplayer shooter featuring addictive 4v1 gameplay. One player-controlled monster must evade and outsmart a team of four uniquely skilled hunters.");
COMMIT;

INSERT INTO COMMENTS VALUES (null, 2, 1, "A revolution for this time without a doubt.");
INSERT INTO COMMENTS VALUES (null, 3, 1, "A game of cubes and survival, very original, I recommend it.");
INSERT INTO COMMENTS VALUES (null, 4, 1, "It seems like an easy game.");
INSERT INTO COMMENTS VALUES (null, 3, 2, "Very good game, and more if it is accompanied by a delicious");
INSERT INTO COMMENTS VALUES (null, 2, 2, "The second best-selling game in history and approximately 8 years old, which is being exploited by rockstar to this day with very acceptable graphics to this day, in addition to being one of the best open world games.");
INSERT INTO COMMENTS VALUES (null, 4, 2, "So good.");
INSERT INTO COMMENTS VALUES (null, 2, 2, "So bad, I dont really like it.");
INSERT INTO COMMENTS VALUES (null, 5, 2, "its okey.");
INSERT INTO COMMENTS VALUES (null, 5, 3, "its okey.");
INSERT INTO COMMENTS VALUES (null, 3, 3, "Very competitive and the games are fast, I love it, I recommend it.");
INSERT INTO COMMENTS VALUES (null, 4, 4, "I hate it, but it's a vice and I can't stop playing it, help.");
INSERT INTO COMMENTS VALUES (null, 3, 5, "It is very very good to be a Beta, I totally recommend it.");
INSERT INTO COMMENTS VALUES (null, 5, 6, "I don't like it, they keep ejecting me for killing a colleague.");
INSERT INTO COMMENTS VALUES (null, 4, 7, "I hate it, but it's a vice and I can't stop playing it, help.");
INSERT INTO COMMENTS VALUES (null, 2, 8, "Its so amazing, I recommend it.");
INSERT INTO COMMENTS VALUES (null, 3, 8, "It's too expensive, I don't recommend it.");
INSERT INTO COMMENTS VALUES (null, 4, 8, "They have raised the price again, I don't see it anymore.");
INSERT INTO COMMENTS VALUES (null, 5, 8, "This game is dead.");
COMMIT;

INSERT INTO MEDIAS VALUES (null, 1, "main_image", "image/png");
INSERT INTO MEDIAS VALUES (null, 1, "trailer", "video/mp4");
INSERT INTO MEDIAS VALUES (null, 2, "trailer", "video/mp4");
INSERT INTO MEDIAS VALUES (null, 2, "main_image", "image/png");
INSERT INTO MEDIAS VALUES (null, 3, "main_image", "image/jpg");
INSERT INTO MEDIAS VALUES (null, 4, "main_image", "image/webp");
INSERT INTO MEDIAS VALUES (null, 4, "zed", "image/jpeg");
INSERT INTO MEDIAS VALUES (null, 4, "trailer", "video/mp4");
INSERT INTO MEDIAS VALUES (null, 4, "teaser-2020", "video/mp4");
INSERT INTO MEDIAS VALUES (null, 5, "main_man_image", "image/jpg");
INSERT INTO MEDIAS VALUES (null, 5, "trailer", "video/mp4");
INSERT INTO MEDIAS VALUES (null, 5, "main_woman_image", "image/jpg");
INSERT INTO MEDIAS VALUES (null, 6, "main_image", "image/png");
INSERT INTO MEDIAS VALUES (null, 7, "main_image", "image/webp");
COMMIT;

/** Categories **/
/* Minecraft */
INSERT INTO categories_games VALUES (1, 1);
INSERT INTO categories_games VALUES (2, 1);
INSERT INTO categories_games VALUES (3, 1);
INSERT INTO categories_games VALUES (4, 1);

/* GTA V */
INSERT INTO categories_games VALUES (1, 2);
INSERT INTO categories_games VALUES (2, 2);
INSERT INTO categories_games VALUES (3, 2);

/* Rocket League */
INSERT INTO categories_games VALUES (1, 3);
INSERT INTO categories_games VALUES (2, 3);
INSERT INTO categories_games VALUES (6, 3);

/* League of legends */
INSERT INTO categories_games VALUES (3, 4);
INSERT INTO categories_games VALUES (8, 4);

/* V Rising */
INSERT INTO categories_games VALUES (1, 5);
INSERT INTO categories_games VALUES (2, 5);
INSERT INTO categories_games VALUES (3, 5);
INSERT INTO categories_games VALUES (4, 5);

/* Among Us */
INSERT INTO categories_games VALUES (4, 6);
INSERT INTO categories_games VALUES (8, 6);

/* Valorant */
INSERT INTO categories_games VALUES (7, 7);
INSERT INTO categories_games VALUES (8, 7);

/* Evolve Stage 2 */
INSERT INTO categories_games VALUES (1, 8);
INSERT INTO categories_games VALUES (2, 8);
INSERT INTO categories_games VALUES (3, 8);
INSERT INTO categories_games VALUES (4, 8);
INSERT INTO categories_games VALUES (5, 8);
INSERT INTO categories_games VALUES (7, 8);
COMMIT;

/** Plataform games **/
/* Accepted types: EUR/USD */
/* Microsoft Games */
INSERT INTO plataforms_games VALUES (1, 1, 25.99, 'EUR', 0.0, 1); /* Minecraft */
INSERT INTO plataforms_games VALUES (1, 6, 4.99, 'EUR', 0.0, 1); /* Among Us */

/* Steam Games */
INSERT INTO plataforms_games VALUES (2, 2, 31.99, 'EUR', 0.3, 1); /* GTA V */
INSERT INTO plataforms_games VALUES (2, 5, 21.18, 'EUR', 0.0, 1); /* V Rising */
INSERT INTO plataforms_games VALUES (2, 6, 3.99, 'EUR', 0.0, 1); /* Among Us */
INSERT INTO plataforms_games VALUES (2, 8, 59.99, 'EUR', 0.0, 0); /* Evolve Stage 2 */

/* Gamivo Games */
INSERT INTO plataforms_games VALUES (3, 1, 19.14, 'EUR', 0.0, 1); /* Minecraft */
INSERT INTO plataforms_games VALUES (3, 3, 357.26, 'EUR', 0.0, 1); /* Rocket League */
INSERT INTO plataforms_games VALUES (3, 5, 21.18, 'EUR', 0.0, 1); /* V Rising */

/* Epic Games */
INSERT INTO plataforms_games VALUES (4, 2, 29.99, 'EUR', 0.5, 1); /* GTA V */
INSERT INTO plataforms_games VALUES (4, 3, 0.00, 'USD', 0.0, 1); /* Rocket League */
INSERT INTO plataforms_games VALUES (4, 6, 3.99, 'EUR', 0.2, 1); /* Among Us */

/* Instant gaming Games */
INSERT INTO plataforms_games VALUES (5, 3, 12.75, 'EUR', 0.0, 1); /* Rocket League */
INSERT INTO plataforms_games VALUES (5, 5, 0.00, 'EUR', 0.0, 0); /* V Rising */

/* Riot Games */
INSERT INTO plataforms_games VALUES (6, 4, 0.00, 'EUR', 0.0, 1); /* League of legends */
INSERT INTO plataforms_games VALUES (6, 7, 0.00, 'EUR', 0.0, 1); /* Valorant */
COMMIT;