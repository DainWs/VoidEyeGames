<?php

namespace src\domain\dto;

class Credentials {
    public function __construct($builder = ['user' => '', 'token' => '', 'expiration' => 0, 'accountType' => 2]) {
        $this->user = $builder['user'];
        $this->token = $builder['token'];
        $this->expiration = $builder['expiration'];
        $this->accountType = $builder['accountType'];
    }

    public function setUser($user) {
        $this->user = $user;
    }

    public function getUser(): ?String {
        return $this->user;
    }

    public function setToken($token) {
        $this->token = $token;
    }

    public function getToken(): ?String {
        return $this->token;
    }

    public function setExpiration($expiration) {
        $this->expiration = $expiration;
    }

    public function getExpiration(): ?String {
        return $this->expiration;
    }

    public function setAccountType($accountType): void {
        $this->accountType = $accountType;
    }

    public function getAccountType() {
        return $this->accountType;
    }
}