<?php
namespace src\validators;

use classes\User\User;
use Exception;
use Monolog\Logger;

class SignUserValidator extends UserValidator {
    public function __construct() {
        parent::__construct();
    }

    public function validate($user): void {
        parent::validate($user);
        $this->logger->log(json_encode($user), Logger::WARNING);

        try {
            if ($this->hasErrors()) return;
            
            $this->logger->log(json_encode($user['name']), Logger::WARNING);
            $this->validateSignName($user['name']);
            $this->validateSignEmail($user['email']);
            $this->validateSignPassword($user['password'], $user['confirmationPassword']);
            $this->validateTerms($user['terms']);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    private function validateSignName($name): void {
        $dbUser = $this->atlas->select(User::class, ['name' => $name])->fetchRecord();
        if ($dbUser) {
            $this->errors['name'] = "Ya existe un usuario con este nombre.";
        }
    }
    
    private function validateSignEmail($email): void {
        $dbUser = $this->atlas->select(User::class, ['email' => $email])->fetchRecord();
        if ($dbUser) {
            $this->errors['email'] = 'Ya existe un usuario con este correo.';
        }
    }

    private function validateSignPassword($password, $confirmPassword): void {
        $this->logger->log($password, Logger::WARNING);
        if (!$this->utils->validatePassword($password, $confirmPassword)) {
            $this->errors['confirmationPassword'] = "Contrase&ntilde;a no encaja con la confirmaci&oacute;n de la misma.";
        }
    }

    private function validateTerms($terms): void {
        $this->logger->log($terms, Logger::WARNING);
        if ($terms !== true) {
            $this->errors['terms'] = "Es obligatorio aceptar los terminos de uso.";
        }
    }
}