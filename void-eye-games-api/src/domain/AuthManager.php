<?php

namespace src\domain;

use Exception;
use Monolog\Logger;
use src\domain\dto\Credentials;
use src\libraries\LogManager;

/**
 * Used to manage and validate the credentials of logged in users.
 * Mostly used by AuthMiddleware
 */
class AuthManager {
    private LogManager $logger;

    public function __construct() {
        $this->logger = new LogManager(AuthManager::class);
    }
    
    /**
     * Registre a username with the specified account type to de credentials cache file.
     * @param String $username
     * @param int|string|null $accountType
     * @return Credentials
     */
    public function registre(String $name, $accountType): Credentials {
        $this->logger->log("Registering credentials for user $name. $accountType");
        $credentials = new Credentials();
        $credentials->setUser($name);
        $credentials->setToken($this->generateToken());
        $credentials->setExpiration(strtotime(date('Y-m-d H:i:s', strtotime('+1 hour'))) * 1000);
        $credentials->setAccountType($accountType ?? ACCOUNT_TYPE_UNKNOWN);
        $this->save($credentials);
        return $credentials;
    }

    /**
     * Create a unique token
     * @return string the token
     */
    private function generateToken(): string {
        return bin2hex(openssl_random_pseudo_bytes(TOKEN_NUM_BYTES));
    }

    /**
     * Save the given credentials into the credentials cache file
     */
    private function save(Credentials $credentials): void {
        $fileContentEncoded = file_get_contents($this->getFile());
        $fileContent = json_decode($fileContentEncoded, true);
        $fileContent['keys'][$credentials->getUser()] = $credentials;
        file_put_contents($this->getFile(), json_encode($fileContent));
    }

    /**
     * validate the given credentials object
     * @param Array $credentials the credentials data as array
     * @return true if the credentials are valid, false otherwise
     */
    public function validate(?Array $credentialsData): bool {
        try {
            if ($credentialsData == null) return false;
            $credentials = new Credentials($credentialsData);
            $cachedCredentials = $this->search($credentials->user);
            if ($cachedCredentials == null) return false;
            if ($cachedCredentials->hasExpired()) return false;
            if ($cachedCredentials->getAccountType() !== $credentials->getAccountType()) return false;
            return ($cachedCredentials->getToken() === $credentials->getToken());
        } catch(Exception $ex) {
            $this->logger->log('Error validating credentials, the credentials Object is '.json_encode($credentials).', the erro message is: '.$ex->getMessage(), Logger::WARNING);
            return false;
        }
    }

    /**
     * Search the username in the credentials cache file
     * @param String $username the username with which the credentials will be identified
     * @return Credentials if the user credentials was found, null otherwise
     */
    public function search(String $username) {
        $this->logger->log("Get saved credentials.", Logger::INFO);
        $fileContentText = file_get_contents($this->getFile());
        $filecontent = json_decode($fileContentText, true);
        return new Credentials($filecontent['keys'][$username]) ?? null;
    }

    /**
     * The credentials cache file
     */
    private function getFile(): string {
        return $_SERVER['APP_BASE_PATH'].'/cache/credentials.json';
    }
}