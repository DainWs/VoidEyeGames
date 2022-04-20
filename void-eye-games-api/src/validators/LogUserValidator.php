<?php
namespace src\validators;

use classes\User\User;
use Exception;
use Monolog\Logger;

class LogUserValidator extends UserValidator {
    public function __construct() {
        parent::__construct();
    }

    public function validate($user): void {
        parent::validate($user);

        try {
            if ($this->hasErrors()) return;

            $dbUser = $this->atlas->select(User::class, ['name' => $user->name])->fetchRecord();
            $this->validateLogDBUser($dbUser);

            if ($dbUser !== null) {
                $this->validateLogPassword($dbUser->password, $user->password);
            }
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }
    
    private function validateLogDBUser($dbUser): void {
        if (!$dbUser) {
            $this->errors['others'] = 'Usuario o contrase&ntilde;a no validos';
        }
    }

    private function validateLogPassword($dbPassword, $password): void {
        if (!$this->utils->validatePassword($dbPassword, $password)) {
            $this->errors['others'] = 'Usuario o contrase&ntilde;a no validos';
        }
    }
}