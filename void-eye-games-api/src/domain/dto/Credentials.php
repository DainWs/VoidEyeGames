<?php
/**
 * File: Credentials.php
 * Purpose: Credentials general DTO model.
 * DB Access: No
 * Uses files:
 *  - NONE
 * Used from:
 *  - src\domain\AuthManager.php
 */
namespace src\domain\dto;

/**
 * This class represents the credentials DTO object.
 */
class Credentials {
    /**
     * The user name (it's unique).
     * @var string $user
     */
    public string $user;

    /**
     * The token (it's unique)
     * @var string $token
     */
    public string $token;

    /**
     * The expiration timestamp.
     * @var int $expiration
     */
    public int $expiration;

    /**
     * It is assigned by the server depending on the user
     * that has logged in, so it is not possible to enter
     * with incorrect errors.
     * @var int $accountType
     */
    public int $accountType;

    /**
     * Creates an instance of this object.
     * 
     * To do this we need an Map with the next entries:
     * - user: The user name (it's unique).
     * - token: The token (it's unique).
     * - expiration: The expiration timestamp.
     * - accountType: the users account type.
     * You can also pass nothing and have it created with the default values.
     * 
     * @param Map $builder 
     */
    public function __construct($builder = ['user' => '', 'token' => '', 'expiration' => 0, 'accountType' => 2]) {
        $this->user = $builder['user'];
        $this->token = $builder['token'];
        $this->expiration = $builder['expiration'];
        $this->accountType = $builder['accountType'];
    }

    /**
     * Changes the user property.
     * @param String $user
     */
    public function setUser($user): void {
        $this->user = $user;
    }

    /**
     * Returns the user name.
     * @return String the user name
     */
    public function getUser(): String {
        return $this->user;
    }

    /**
     * Changes the token property.
     * @param String $token
     */
    public function setToken($token): void {
        $this->token = $token;
    }

    /**
     * Returns the credentials token.
     * @return String the credentials token
     */
    public function getToken(): String {
        return $this->token;
    }

    /**
     * Changes the expiration date property.
     * @param String $expiration
     */
    public function setExpiration(int $expiration): void {
        $this->expiration = $expiration;
    }

    /**
     * Returns the expiration timestamp.
     * @return int expiration timestamp
     */
    public function getExpiration(): String {
        return $this->expiration;
    }

    /**
     * Changes the account type property.
     * For this property set, See:
     * - ACCOUNT_TYPE_ADMIN
     * - ACCOUNT_TYPE_LOGGED_USER 
     * - ACCOUNT_TYPE_UNKNOWN
     * 
     * @param String $accountType
     */
    public function setAccountType(int $accountType): void {
        $this->accountType = $accountType;
    }

    /**
     * Returns the accountType.
     * @return int accountType
     */
    public function getAccountType(): int {
        return $this->accountType;
    }

    /**
     * Check if this credentials has expired.
     * @return true if was expired, false otherwise.
     */
    public function hasExpired(): bool {
        return ($this->expiration <= strtotime(date('Y-m-d H:i:s')));
    }
}