<?php

namespace src\domain;

use Monolog\Logger;
use src\domain\dto\Credentials;
use src\libraries\LogManager;

class JWTManager {
    public function __construct() {
        $this->logger = new LogManager(BaseController::class);
    }
    
    public function generate(String $username, $accountType){
        $this->logger->log("Generating credentials.", Logger::INFO);
        $credentials = new Credentials();
        $credentials->setUser($username);
        $credentials->setToken(bin2hex(openssl_random_pseudo_bytes(16)));
        $credentials->setExpiration(strtotime(date('Y-m-d H:i:s', strtotime('+1 hour'))));
        $credentials->setAccountType($accountType);
        $this->save($credentials);
        return $credentials;
    }

    public function save($credentials) {
        $this->logger->log("Save credentials.", Logger::INFO);
        $fileContentText = file_get_contents($this->getFile());
        $filecontent = json_decode($fileContentText, true);
        $filecontent['keys'][$credentials->user] = $credentials;
        file_put_contents($this->getFile(), json_encode($filecontent));
    }

    public function get(String $username) {
        $this->logger->log("Get saved credentials.", Logger::INFO);
        $fileContentText = file_get_contents($this->getFile());
        $filecontent = json_decode($fileContentText, true);
        return new Credentials($filecontent['keys'][$username]) ?? null;
    }

    public function validate($credentials) {
        $this->logger->log("Validation called: " . json_encode($credentials), Logger::INFO);
        if ($credentials->user === null || $credentials->expiration === null) return false;
        $savedCredential = $this->get($credentials->user);
        $this->logger->log("Time: " . strtotime(date('Y-m-d H:i:s')), Logger::INFO);
        if ($savedCredential->expiration <= strtotime(date('Y-m-d H:i:s'))) {
            return false;
        }
        $this->logger->log("Time: " . ($savedCredential->token == $credentials->token), Logger::INFO);
        return ($savedCredential->token == $credentials->token);
    }

    private function getFile(): string {
        return $_SERVER['APP_BASE_PATH'].'/credentials/jwt-keys.json';
    }
}