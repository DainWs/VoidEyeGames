<?php
namespace src\validators;

use classes\User\User;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

class LogUserValidator extends UserValidator {
    public function __construct() {
        parent::__construct();
    }

    public function validate($user): void {
        try {
            if ($user === null) throw new InvalidArgumentException("User is null, invalid argument");

            $dbUser = $this->atlas->select(User::class, ['name' => $user['username']])->fetchRecord();
            if ($dbUser !== null) {
                $this->errors['others'] = 'Usuario o contrase&ntilde;a no validos';
            } else {
                $this->validateLogPassword($dbUser['password'], $user['password']);
            }
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    private function validateLogPassword($dbPassword, $password): void {
        if (!$this->utils->validatePassword($dbPassword, $password)) {
            $this->errors['others'] = 'Usuario o contrase&ntilde;a no validos';
        }
    }
}