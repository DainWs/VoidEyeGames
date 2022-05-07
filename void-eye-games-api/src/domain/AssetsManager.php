<?php

namespace src\domain;

use src\libraries\LogManager;

class AssetsManager {

    private static ?AssetsManager $instance = null;

    public static function getInstance(): AssetsManager {
        if (AssetsManager::$instance == null) {
            AssetsManager::$instance = new AssetsManager();
        }
        return AssetsManager::$instance;
    }

    private LogManager $logger;

    private function __construct() {
        $this->logger = new LogManager(AssetsManager::class);
    }
    
    public function writeAssets($path, $filename, $src) {
        $this->logger->log($path);
        $this->logger->log(!is_writable($path));
        if (!is_writable($path)) {
            chmod($path, 0777);
        }
        file_put_contents("$path/$filename", $src);
    }
}