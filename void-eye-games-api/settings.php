<?php
include_once('./src/config/constants.php');
define('APP_ROOT', __DIR__);

$dbDomain = ($_SERVER['DB_DOMAIN'] ?? DB_DEFAULT_DOMAIN);
$dbName = ($_SERVER['DB_NAME'] ?? DB_DEFAULT_NAME);
$dbUser = ($_SERVER['DB_USER'] ?? DB_DEFAULT_USER);
$dbPass = ($_SERVER['DB_PASSWORD'] ?? DB_DEFAULT_PASSWORD);

return [
    'settings' => [
        'displayErrorDetails' => true,
        'determineRouteBeforeAppMiddleware' => false,

        'atlas' => [
            'pdo' => [
                "mysql:dbname=$dbName;host=$dbDomain",
                $dbUser,
                $dbPass,
            ],
            'namespace' => 'classes',
            'directory' => __DIR__ . '\src\classes',
        ]    
    ]
];