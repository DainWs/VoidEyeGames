/*
 * This is the first SQL file to execute, this one will create:
 * - Database
 * - Tables
 * 
 * If you want to have a specific user for this database, 
 * you can execute SQLMyUser.sql after this
 */
SET NAMES UTF8;
CREATE DATABASE IF NOT EXISTS VOID_EYE_GAMES;
USE VOID_EYE_GAMES;

DROP TABLE IF EXISTS plataforms_games;
DROP TABLE IF EXISTS categories_games;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS medias;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS plataforms;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users( 
	id			INT(255) auto_increment NOT NULL,
	name		VARCHAR(100) NOT NULL UNIQUE,
	password	VARCHAR(255) NOT NULL,
	email		VARCHAR(255) NOT NULL UNIQUE,
	imageUrl	VARCHAR(255),
	publicityAccepted BOOLEAN DEFAULT 0,
	accountType	INT(1) DEFAULT 1 CHECK (accountType IN (0, 1, 2, 3)),
	CONSTRAINT pk_users PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS plataforms(
	id		INT(255) auto_increment NOT NULL,
	name	VARCHAR(100) NOT NULL UNIQUE,
	url		VARCHAR(255),
	CONSTRAINT pk_plataforms PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS games(
	id              INT(255) auto_increment NOT NULL,
	name          	VARCHAR(100) NOT NULL UNIQUE,
	descripcion    	TEXT,
	CONSTRAINT pk_games PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS categories(
	id              INT(255) auto_increment NOT NULL,
	name          	VARCHAR(100) NOT NULL UNIQUE,
	CONSTRAINT pk_categories PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS categories_games(
	categoriesId	INT(255) NOT NULL,
	gamesId			INT(255) NOT NULL,
	CONSTRAINT pk_categories_games PRIMARY KEY(categoriesId, gamesId)
);

ALTER TABLE categories_games ADD CONSTRAINT fk_categories_games_games FOREIGN KEY(gamesId) REFERENCES games(id);
ALTER TABLE categories_games ADD CONSTRAINT fk_categories_games_plataforms FOREIGN KEY(categoriesId) REFERENCES categories(id);

CREATE TABLE IF NOT EXISTS plataforms_games(
	plataformsId	INT(255) NOT NULL,
	gamesId			INT(255) NOT NULL,
	price			FLOAT(100,2) NOT NULL,
	priceUnit		VARCHAR(100) NOT NULL,
	discount		FLOAT(3,2) NOT NULL CHECK (discount >= 0.0 AND discount <= 1.0),
	isEnabled		BOOLEAN NOT NULL DEFAULT 1,
	CONSTRAINT pk_plataforms_games PRIMARY KEY(plataformsId, gamesId)
);

ALTER TABLE plataforms_games ADD CONSTRAINT fk_plataforms_games_games FOREIGN KEY(gamesId) REFERENCES games(id);
ALTER TABLE plataforms_games ADD CONSTRAINT fk_plataforms_games_plataforms FOREIGN KEY(plataformsId) REFERENCES plataforms(id);

CREATE TABLE IF NOT EXISTS medias(
	id          INT(255) auto_increment NOT NULL,
	gamesId		INT(255) NOT NULL,
	name		VARCHAR(100) NOT NULL,
	mediaType	VARCHAR(100) NOT NULL DEFAULT "image/png",
	CONSTRAINT pk_medias PRIMARY KEY(id, gamesId)
);

ALTER TABLE medias ADD CONSTRAINT fk_medias_games FOREIGN KEY(gamesId) REFERENCES games(id);

CREATE TABLE IF NOT EXISTS comments(
	id              INT(255) auto_increment NOT NULL,
	usersId         INT(255) NOT NULL,
	gamesId       	INT(255) NOT NULL,
	description     VARCHAR(255) NOT NULL,
	CONSTRAINT pk_comments PRIMARY KEY(id)
);

ALTER TABLE comments ADD CONSTRAINT fk_comments_users FOREIGN KEY(usersId) REFERENCES users(id);
ALTER TABLE comments ADD CONSTRAINT fk_comments_games FOREIGN KEY(gamesId) REFERENCES games(id);