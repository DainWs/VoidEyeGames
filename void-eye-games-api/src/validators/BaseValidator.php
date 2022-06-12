<?php
/**
 * File: BaseValidator.php
 * Purpose: Is the main class used for validations, all
 * validation classes has to extends from this one.
 * DB Access: No
 * Uses files:
 *  - src\libraries\LogManager.php
 * Used from:
 *  - src\validators\*.php
 */
namespace src\validators;

use src\libraries\LogManager;

/**
 * The base abstract validator class, used to validate data.
 * 
 * All validators must extend this.
 */
abstract class BaseValidator {
    protected LogManager $logger;
    protected Array $errors;

    public function __construct() {
        $this->logger = new LogManager(BaseValidator::class);
        $this->errors = [];
    }

    public abstract function validate($data): void;

    /**
     * Returns the errors generated while the validation.
     * @return the errors generated while the validation.
     */
    public function getErrors(): Array {
        return $this->errors;
    }

    /**
     * Checks if has errors.
     * @return true if has errors, false otherwise.
     */
    public function hasErrors(): bool {
        return (count($this->errors) > 0);
    }
}