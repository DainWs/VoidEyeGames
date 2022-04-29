<?php

namespace src\validators;

final class ValidationUtils {
    private static ?ValidationUtils $instance = null;

    public static function getInstance(): ValidationUtils {
        if (SELF::$instance == null) {
            SELF::$instance = new ValidationUtils();
        }
        return SELF::$instance;
    }

    private function __construct() {}

    public function validateNotEmpty($value): bool {
        return ($value) && !empty($value);
    }

    public function validateNumber($value): bool {
        return is_numeric($value);
    }

    public function validateEmail($email): bool {
        return preg_match("/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/i", $email);
    }

    public function validatePassword($password, $otherPassword = null): bool {
        $result = $this->validateNotEmpty($password);
        if ($otherPassword) {
            $result &= ($password === $otherPassword);
        }
        return $result;
    }
}