<?php

namespace src\domain\dto;

/**
 * This class represents the credentials DTO object.
 */
class Credentials {
    public string $user;
    public string $token;
    public int $expiration;
    public int $accountType;

    public function __construct($builder = ['user' => '', 'token' => '', 'expiration' => 0, 'accountType' => 2]) {
        $this->user = $builder['user'];
        $this->token = $builder['token'];
        $this->expiration = $builder['expiration'];
        $this->accountType = $builder['accountType'];
    }

    public function setUser($user): void {
        $this->user = $user;
    }

    public function getUser(): String {
        return $this->user;
    }

    public function setToken($token): void {
        $this->token = $token;
    }

    public function getToken(): String {
        return $this->token;
    }

    public function setExpiration(int $expiration): void {
        $this->expiration = $expiration;
    }

    public function getExpiration(): String {
        return $this->expiration;
    }

    public function setAccountType(int $accountType): void {
        $this->accountType = $accountType;
    }

    public function getAccountType(): int {
        return $this->accountType;
    }

    public function hasExpired(): bool {
        return ($this->expiration <= strtotime(date('Y-m-d H:i:s')));
    }
}