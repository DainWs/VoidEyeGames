<?php
namespace src\validators;

use Atlas\Orm\Atlas;
use classes\User\User;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

class UserValidator extends BaseValidator {
    private Atlas $atlas;

    public function __construct() {
        parent::__construct();
    }

    public function setAtlas(Atlas $atlas): void {
        $this->atlas = $atlas;
    }

    public function validate($user): void {
        try {
            if ($user === null) throw new InvalidArgumentException("User is null, invalid argument");

            $dbUser = $this->atlas->select(User::class, ['name' => $user->name])->fetchRecord();
            if ($dbUser != null) {
                $this->errors['name'] = "Ya existe un usuario con este nombre.";
            }

            $dbUser = $this->atlas->select(User::class, ['email' => $user->email])->fetchRecord();
            if ($dbUser != null) {
                $this->errors['email'] = "Ya existe un usuario con este correo.";
            }

            if ($user->password !== $user->confirmedPassword) {
                $this->errors['confirmedPassword'] = "Ya existe un usuario con este correo.";
            }

            if ($user->terms !== true) {
                $this->errors['terms'] = "Es obligatorio aceptar los terminos de uso.";
            }
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }
}