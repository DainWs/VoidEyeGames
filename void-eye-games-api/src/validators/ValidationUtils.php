<?php
/**
 * File: ValidationUtils.php
 * Purpose: This is a static class with generic operations validations.
 * DB Access: No
 * Uses files:
 *  - None
 * Used from:
 *  - src\validators\*.php
 */
namespace src\validators;

/**
 * A class used for validations
 */
final class ValidationUtils {
    private static ?ValidationUtils $instance = null;

    /**
     * Returns the static instance for this class
     * @return the static instance for this class.
     */
    public static function getInstance(): ValidationUtils {
        if (SELF::$instance == null) {
            SELF::$instance = new ValidationUtils();
        }
        return SELF::$instance;
    }

    private function __construct() {}

    /**
     * Validates an object and check if is not empty
     * @return true if the object is not empty.
     */
    public function validateNotEmpty($value): bool {
        return ($value) && !empty($value);
    }

    /**
     * Validates an object and check if is a number
     * @return true if the object is a number.
     */
    public function validateNumber($value): bool {
        return is_numeric($value);
    }

    /**
     * Validates an email
     * @return true if the email is valid.
     */
    public function validateEmail($email): bool {
        return preg_match("/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/i", $email);
    }

    /**
     * Checks if a password id equals to other.
     * @return true if the password is correct.
     */
    public function validatePassword($password, $otherPassword = null): bool {
        $result = $this->validateNotEmpty($password);
        if ($otherPassword) {
            $result &= ($password === $otherPassword);
        }
        return $result;
    }
}