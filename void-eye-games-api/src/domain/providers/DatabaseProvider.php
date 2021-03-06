<?php
/**
 * File: DatabaseProvider.php
 * Purpose: Provides the instance of PDO object.
 * DB Access: Yes
 * Uses files:
 *  - None
 * Used from:
 *  - src\controllers\BaseController.php
 */
namespace src\domain\providers;

use PDO;

/**
 * Creates and provide the PDO instance.
 */
class DatabaseProvider {
    private static ?PDO $instance = null;

    /**
     * Creates a new instance of Atlas
     */
    public static function newInstance(): PDO {
        return SELF::getInstance();
    }

    /**
     * Returns the PDO Instance, if is not set, then this method create it too.
     */
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