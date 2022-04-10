<?php
include_once('src/config/constants.php');

{/** Encapsulation Scope */
    /**
     * Use to load the current base url/path for diferents servers
     */
    function loadServerBase() {
        $contextPath = $_SERVER['DOCUMENT_ROOT'];
    
        $relativePath = str_replace($contextPath, '', str_replace('\\', '/', __DIR__));
        $scheme = $_SERVER['REQUEST_SCHEME'];
        $serverName = $_SERVER['SERVER_NAME'];
        $serverPort = $_SERVER['SERVER_PORT'];
    
        $_SERVER['APP_BASE_URL'] = "$scheme://$serverName:$serverPort$relativePath";
        $_SERVER['APP_BASE_PATH'] = __DIR__;
    }
    loadServerBase();
}

function autoloadDir($dir = __DIR__.'/src') {
    $files = glob("$dir/*");
    foreach ($files as $file) {
        if (is_dir($file)) {
            autoloadDir($file);
        } else {
            if (preg_match('/\.php/', $file)) {
                include_once($file);
            }
        }
    }
}

include_once('vendor/autoload.php');

spl_autoload_register(function($class) {
    if (file_exists(__DIR__."\\$class.php")) {
        include_once(__DIR__."\\$class.php");
    }
    autoloadDir();
});
