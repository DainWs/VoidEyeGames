<?php

namespace src\services\db;

use PDO;

/**
 * Esta clase se encarga de crear la conexion singleton con la base de datos
 */
abstract class DBConnection {

    //PDO singleton instance
    protected static PDO $connection;

    /**
     * Constructor por defecto, crea la base de datos
     */
    public function __construct() {
        if (!isset($this::$connection)) {
            $dbDomain = ($_SERVER['DB_DOMAIN'] ?? DB_DEFAULT_DOMAIN);
            $dbName = ($_SERVER['DB_NAME'] ?? DB_DEFAULT_NAME);
            $dbUser = ($_SERVER['DB_USER'] ?? DB_DEFAULT_USER);
            $dbPass = ($_SERVER['DB_PASSWORD'] ?? DB_DEFAULT_PASSWORD);
            $url = "mysql:dbname=$dbName;host=$dbDomain";
            $this::$connection = new PDO($url, $dbUser, $dbPass);
        }
    }
}