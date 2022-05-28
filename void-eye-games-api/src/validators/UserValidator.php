<?php
namespace src\validators;

use Atlas\Orm\Atlas;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

/**
 * A validator class for user objects
 */
class UserValidator extends BaseValidator {
    protected Atlas $atlas;
    protected ValidationUtils $utils;

    public function __construct() {
        parent::__construct();
        $this->utils = ValidationUtils::getInstance();
    }

    public function setAtlas(Atlas $atlas): void {
        $this->atlas = $atlas;
    }

    public function validate($user): void {
        try {
            if ($user === null) throw new InvalidArgumentException("User is null, invalid argument");

            $this->validateName($user['name']);
            $this->validateEmail($user['email']);

            if ($user['password'] !== $user['confirmationPassword']) {
                $this->errors['confirmationPassword'] = "Ya existe un usuario con este correo.";
            }

            if ($user['terms'] !== true) {
                $this->errors['terms'] = "Es obligatorio aceptar los terminos de uso.";
            }
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    private function validateName($name): void {
        if (!$this->utils->validateNotEmpty($name)) {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        }
    }

    private function validateEmail($email): void {
        if (!$this->utils->validateNotEmpty($email)) {
            $this->errors['email'] = 'El campo "email" es obligatorio.';
        }

        if (!$this->utils->validateEmail($email)) {
            $this->errors['email'] = 'El email indicado no es valido.';
        }
    }
}