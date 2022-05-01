USE void_eye_games;

INSERT INTO CATEGORIES VALUES (null, "Accion");
INSERT INTO CATEGORIES VALUES (null, "Un jugador");
INSERT INTO CATEGORIES VALUES (null, "Multijugador");
INSERT INTO CATEGORIES VALUES (null, "Supervivencia");
INSERT INTO CATEGORIES VALUES (null, "RPG");
INSERT INTO CATEGORIES VALUES (null, "Coches");

INSERT INTO PLATAFORMS VALUES (null, "Microsoft", "https://www.xbox.com/es-es/promotions/sales/spring-sale");
INSERT INTO PLATAFORMS VALUES (null, "Steam", "https://store.steampowered.com/?l=spanish");
INSERT INTO PLATAFORMS VALUES (null, "Gamivo", "https://www.gamivo.com/");
INSERT INTO PLATAFORMS VALUES (null, "Epic games", "https://www.epicgames.com/site/es-ES/home");
INSERT INTO PLATAFORMS VALUES (null, "Instant gaming", "https://www.instant-gaming.com/es/");

/* The password is 'prueba' */
INSERT INTO USERS VALUES (null, "admin", "c893bad68927b457dbed39460e6afd62", "void.eye.games@gmail.com", 'logo.png', 0, 0);
INSERT INTO USERS VALUES (null, "Juan Alverto", "c893bad68927b457dbed39460e6afd62", "Juan@void.eye.games.com", null, 1, 1);
INSERT INTO USERS VALUES (null, "Pepito Golosinas", "c893bad68927b457dbed39460e6afd62", "PepitoGolosinas@void.eye.games.com", null, 0, 1);

INSERT INTO GAMES VALUES (null, "Minecraft", "What is it? Minecraft is a video game in which players create and break apart various kinds of blocks in three-dimensional worlds. The game’s two main modes are Survival and Creative. In Survival, players must find their own building supplies and food. They also interact with blocklike mobs, or moving creatures. (Creepers and zombies are some of the dangerous ones.) In Creative, players are given supplies and do not have to eat to survive. They also can break all kinds of blocks immediately.<br/>Are there points or levels? No. The purpose of the game is simply to build and explore (and survive).<br/>How many players can play it? You can play by yourself or you can play online with others. The smartphone and tablet versions offer multi-player options through WiFi networks. Players can connect to thousands of Minecraft online games (servers), some of which involve battling other players.<br/>Which devices can I play it on? There are versions for PCs, Macs and Xbox 360. There’s also a version for iPhone, iPad, Kindle Fire and Android smartphones.");
INSERT INTO GAMES VALUES (null, "GTA V", "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves involved with the worst and most insane of the criminal underworld, the US government and the entertainment industry, they must pull off a series of dangerous hits to survive in an unforgiving city where no one can be trusted. And much less in each other.<br/><br/>Grand Theft Auto V for PC gives gamers the option to explore the award-winning world of Los Santos and Blaine County in 4K resolution and enjoy gameplay at 60 frames per second.<br/><br/>The game features multiple and varied PC-specific customization options, with over 25 different configurable settings for texture quality, shader, tessellation, anti-aliasing, and many other items, as well as mouse and keyboard customization options. It is also possible to modify the population density to control vehicle and pedestrian traffic, and it is compatible with two and three monitors, 3D and plug-and-play controllers.<br/><br/>Grand Theft Auto V for PC also includes Grand Theft Auto Online, supporting 30 players and two spectators. Grand Theft Auto Online for PC will include all Rockstar-created enhancements and content since the launch date of Grand Theft Auto Online, including Heists and Adversary Modes.<br/><br/>The PC version of Grand Theft Auto V and Grand Theft Auto Online features First Person View, giving players the ability to explore every detail of the world of Los Santos and Blaine County in a whole new way.<br/><br/>Grand Theft Auto V for PC also features the new Rockstar Editor, a set of tools that make it quick and easy to record, edit and share videos from Grand Theft Auto V and Grand Theft Auto Online. Thanks to the Rockstar Editor's director mode, players can bring their ideas to life and create scenes with in-game characters, pedestrians and even animals. The editor has advanced camera movement techniques, editing effects such as slow or fast motion images, various camera filters, the ability to add songs from GTA V radio stations or dynamically control the intensity of the music of the game. Finished videos can be uploaded directly to YouTube and the Rockstar Games Social Club from within the Rockstar Editor for easy sharing.<br/><br/>The Alchemist and Oh No, composers of the soundtrack, are the announcers of the new in-game radio, 'The Lab FM', which broadcasts new and exclusive songs from these two artists inspired by the original music of the game. Other guest artists like Earl Sweatshirt, Freddie Gibbs, Little Dragon, Killer Mike and Sam Herring of Future Islands, to name a few, also collaborate. Players can also discover Los Santos and Blaine County while listening to their own music on 'Your Radio,' a new station with a player-created and personalized soundtrack.");
INSERT INTO GAMES VALUES (null, "Rocket League", "Rocket League is a fantastical sport-based video game, developed by Psyonix (it's “soccer with cars”). It features a competitive game mode based on teamwork and outmaneuvering opponents. Players work with their team to advance the ball down the field, and score goals in their opponents' net.");

INSERT INTO COMMENTS VALUES (null, 2, 1, "Un comentario de ejemplo");
INSERT INTO COMMENTS VALUES (null, 3, 2, "Very good game, and more if it is accompanied by a delicious");
INSERT INTO COMMENTS VALUES (null, 2, 2, "The second best-selling game in history and approximately 8 years old, which is being exploited by rockstar to this day with very acceptable graphics to this day, in addition to being one of the best open world games.");
INSERT INTO COMMENTS VALUES (null, 3, 2, "So good.");
INSERT INTO COMMENTS VALUES (null, 2, 2, "So bad, I dont really like it.");
INSERT INTO COMMENTS VALUES (null, 3, 2, "its okey.");

INSERT INTO MEDIAS VALUES (null, 1, "image/png");
INSERT INTO MEDIAS VALUES (null, 1, "video/mp4");
INSERT INTO MEDIAS VALUES (null, 2, "video/webm");
INSERT INTO MEDIAS VALUES (null, 2, "image/png");
INSERT INTO MEDIAS VALUES (null, 3, "image/jpg");

INSERT INTO categories_games VALUES (1, 1);
INSERT INTO categories_games VALUES (2, 1);
INSERT INTO categories_games VALUES (3, 1);
INSERT INTO categories_games VALUES (4, 1);
INSERT INTO categories_games VALUES (1, 2);
INSERT INTO categories_games VALUES (2, 2);
INSERT INTO categories_games VALUES (3, 2);
INSERT INTO categories_games VALUES (1, 3);
INSERT INTO categories_games VALUES (2, 3);
INSERT INTO categories_games VALUES (6, 3);

INSERT INTO plataforms_games VALUES (1, 1, 25.99, 'EUR', 0.0, 1);
INSERT INTO plataforms_games VALUES (3, 1, 15.99, 'EUR', 0.0, 1);
INSERT INTO plataforms_games VALUES (2, 2, 31.99, 'EUR', 0.3, 1);
INSERT INTO plataforms_games VALUES (4, 2, 28.99, 'EUR', 0.0, 1);
INSERT INTO plataforms_games VALUES (3, 3, 12.75, 'EUR', 0.0, 1);
INSERT INTO plataforms_games VALUES (4, 3, 12.00, 'USD', 0.0, 1);
INSERT INTO plataforms_games VALUES (5, 3, 12.75, 'EUR', 0.0, 0);