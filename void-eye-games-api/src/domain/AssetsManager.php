<?php

namespace src\domain;

use src\libraries\LogManager;

/**
 * Used for images/video management.
 */
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
    
    /**
     * Write image/video src into a file in the assets folder.
     */
    public function writeAssets($path, $filename, $src): void {
        $this->logger->log("File $path/$filename will/has change.");
        if (!is_writable($path)) {
            chmod($path, 0777);
        }
        file_put_contents("$path/$filename", $src);
    }
}