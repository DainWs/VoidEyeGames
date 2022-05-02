USE void_eye_games;

SELECT * FROM categories;
SELECT * FROM categories_games;
SELECT * FROM comments;
SELECT * FROM games;
SELECT * FROM medias;
SELECT * FROM plataforms;
SELECT * FROM plataforms_games;
SELECT * FROM users;

USE void_eye_games;
SELECT * FROM users;

USE void_eye_games;
SELECT * FROM categories;
SELECT * FROM categories_games;

USE void_eye_games;
SELECT * FROM plataforms_games;

USE void_eye_games;
SELECT gamesId, count(gamesId) as numCategories FROM `categories_games` WHERE categoriesId IN(6, 3) GROUP BY gamesId HAVING numCategories = 2;