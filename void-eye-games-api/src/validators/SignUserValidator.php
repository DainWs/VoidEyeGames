<?php
/**
 * File: SignUserValidator.php
 * Purpose: Validates user sign in objects.
 * DB Access: Si (Checkea existencia de objeto)
 * Uses files:
 *  - classes\User\User.php
 *  - src\validators\BaseValidator.php
 * Used from:
 *  - src\controllers\SessionController.php
 */
namespace src\validators;

use classes\User\User;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

/**
 * A validator class for sign case of user objects.
 * @uses BaseValidator
 */
class SignUserValidator extends BaseValidator {

    /**
     * Validates a User object in a Array representation.
     * @param $user the user object as array.
     */
    public function validate($user): void {
        try {
            if ($user === null) throw new InvalidArgumentException("User is null, invalid argument");
            
            $this->validateSignName($user['name']);
            $this->validateSignEmail($user['email']);
            $this->validateSignPassword($user['password'], $user['confirmationPassword']);
            $this->validateTerms($user['terms']);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    /**
     * Validates user name, if found errors, this method 
     * will append its to the $errors array property
     * @param $name the name to validate.
     */
    private function validateSignName($name): void {
        if ($this->utils->validateNotEmpty($name)) {
            $dbUser = $this->atlas->select(User::class, ['name' => $name])->fetchRecord();

            if ($dbUser !== null) {
                $this->errors['name'] = 'Ya existe un usuario con este nombre.';
            }
        } else {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        }
    }
    
    /**
     * Validates user email, if found errors, this method 
     * will append its to the $errors array property
     * @param $email the email to validate.
     */
    private function validateSignEmail($email): void {
        if (!$this->utils->validateNotEmpty($email)) {
            $this->errors['email'] = 'El campo "email" es obligatorio.';
            return;
        }

        if (!$this->utils->validateEmail($email)) {
            $this->errors['email'] = 'El email indicado no es valido.';
            return;
        }

        $dbUser = $this->atlas->select(User::class, ['email' => $email])->fetchRecord();
        if ($dbUser !== null) {
            $this->errors['email'] = 'Ya existe un usuario con este correo.';
        }
    }

    /**
     * Validates user password, if found errors, this method 
     * will append its to the $errors array property
     * @param $password the password to validate.
     * @param $confirmPassword the confirmPassword to validate.
     */
    private function validateSignPassword($password, $confirmPassword): void {
        if (!$this->utils->validateNotEmpty($password)) {
            $this->errors['password'] = 'El campo "password" es obligatorio.';
        }

        if (!$this->utils->validateNotEmpty($confirmPassword)) {
            $this->errors['confirmationPassword'] = 'El campo "confirmationPassword" es obligatorio.';
        }

        if (!$this->hasErrors() && !$this->utils->validatePassword($password, $confirmPassword)) {
            $this->errors['confirmationPassword'] = 'Contrase&ntilde;a no encaja con la confirmaci&oacute;n de la misma.';
        }
    }

    /**
     * Validates user terms, if found errors, this method 
     * will append its to the $errors array property
     * @param $terms the terms to validate.
     */
    private function validateTerms($terms): void {
        if ($terms !== true) {
            $this->errors['terms'] = 'Es obligatorio aceptar los terminos de uso.';
        }
    }
}