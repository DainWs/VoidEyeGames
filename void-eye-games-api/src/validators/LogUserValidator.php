<?php
/**
 * File: LogUserValidator.php
 * Purpose: Validates user logging objects.
 * DB Access: Si (Checkea existencia de objeto)
 * Uses files:
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
 * A validator class for login cases of user objects
 * @uses BaseValidator
 */
class LogUserValidator extends BaseValidator {

    /**
     * Validates a User object in a Array representation.
     * @param $user the user object as array.
     */
    public function validate($user): void {
        try {
            if ($user === null) throw new InvalidArgumentException("User is null, invalid argument");

            $this->validateName($user['username'] ?? null);
            $this->validatePassword($user['password'] ?? null);
            if ($this->hasErrors()) return;
            $this->validateExists($user);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    /**
     * Validates if user exists, if found errors, this method 
     * will append its to the $errors array property
     * @param $user the user to validate.
     */
    private function validateExists($user): void {
        $username = $user['username'] ?? null;
        if ($username === null) {
            $this->errors['others'] = 'Usuario o contrase&ntilde;a no validos';
            return;
        }

        $dbUser = $this->atlas->select(User::class, ['name' => $username])->fetchRecord();
        if ($dbUser === null) {
            $this->errors['others'] = "No existe un usuario llamado '$username'.";
        } else {
            $this->validateLogPassword($dbUser->password, $user['password']);
        }
    }

    /**
     * Validates user name, if found errors, this method 
     * will append its to the $errors array property
     * @param $name the name to validate.
     */
    private function validateName($name): void {
        if (!$this->utils->validateNotEmpty($name)) {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        }
    }

    /**
     * Validates user password, if found errors, this method 
     * will append its to the $errors array property
     * @param $password the password to validate.
     */
    private function validatePassword($password): void {
        if (!$this->utils->validateNotEmpty($password)) {
            $this->errors['password'] = 'El campo "password" es obligatorio.';
        }
    }

    /**
     * Validates user password, if found errors, this method 
     * will append its to the $errors array property
     * @param $password the password to validate.
     * @param $confirmPassword the confirmPassword to validate.
     */
    private function validateLogPassword($dbPassword, $password): void {
        if (!$this->utils->validatePassword($dbPassword, $password)) {
            $this->errors['others'] = 'Usuario o contrase&ntilde;a no validos';
        }
    }
}