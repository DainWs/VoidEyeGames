<?php
namespace src\domain;

use PDO;
use Slim\Container;

class DatabaseProvider {
    private static ?PDO $instance = null;

    public static function newInstance(): PDO {
        return SELF::getInstance();
    }

    public static function getInstance(): PDO {
        if (SELF::$instance == null) {
            $dbDomain = ($_SERVER['DB_DOMAIN'] ?? DB_DEFAULT_DOMAIN);
            $dbName = ($_SERVER['DB_NAME'] ?? DB_DEFAULT_NAME);
            $dbUser = ($_SERVER['DB_USER'] ?? DB_DEFAULT_USER);
            $dbPass = ($_SERVER['DB_PASSWORD'] ?? DB_DEFAULT_PASSWORD);
            $url = "mysql:dbname=$dbName;host=$dbDomain";
            $pdo = new PDO($url, $dbUser, $dbPass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            SELF::$instance = $pdo;
        }
        return SELF::$instance;
    }
}