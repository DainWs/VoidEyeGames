<?php

namespace src\domain;

use src\domain\dto\Credentials;
use src\libraries\LogManager;

class JWTManager {
    public function __construct() {
    }
    
    public function generate(String $username, $accountType){
        $credentials = new Credentials();
        $credentials->setUser($username);
        $credentials->setToken(bin2hex(openssl_random_pseudo_bytes(16)));
        $credentials->setExpiration(strtotime(date('Y-m-d H:i:s', strtotime('+1 hour'))));
        $credentials->setAccountType($accountType);
        $this->save($credentials);
        return $credentials;
    }

    public function save($credentials) {
        $fileContentText = file_get_contents($this->getFile());
        $filecontent = json_decode($fileContentText, true);
        $filecontent['keys'][$credentials->user] = $credentials;
        file_put_contents($this->getFile(), json_encode($filecontent));
    }

    public function get(String $username) {
        $fileContentText = file_get_contents($this->getFile());
        $filecontent = json_decode($fileContentText);
        return $filecontent->keys[$username] ?? null;
    }

    public function validate($credentials) {
        $savedCredential = $this->get($credentials->user);
        if ($savedCredential->expiration <= $credentials->expiration) {
            return false;
        }
        return ($savedCredential->token === $credentials->token);
    }

    private function getFile(): string {
        return $_SERVER['APP_BASE_PATH'].'/credentials/jwt-keys.json';
    }
}