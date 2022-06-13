<?php
/**
 * File: BaseValidator.php
 * Purpose: Is the main class used for validations, all
 * validation classes has to extends from this one. 
 * (The ValidationUtils.php is a static class, and its 
 * the only one that do not extends from this)
 * DB Access: No
 * Uses files:
 *  - src\libraries\LogManager.php
 *  - src\validators\ValidationUtils.php
 * Used from:
 *  - src\validators\CategoryValidator.php
 *  - src\validators\GameValidator.php
 *  - src\validators\LogUserValidator.php
 *  - src\validators\SignUserValidator.php
 *  - src\validators\PlataformValidator.php
 */
namespace src\validators;

use Atlas\Orm\Atlas;
use src\libraries\LogManager;

/**
 * The base abstract validator class, used to validate data.
 * 
 * All validators must extend this.
 * 
 * @uses ValidationUtils
 * @uses LogManager
 */
abstract class BaseValidator {
    /**
     * ValidationUtils instance, used for basic validations.
     * @var ValidationUtils $utils
     */
    protected ValidationUtils $utils;

    /**
     * LogManager instance, used for logs.
     * @var LogManager $logger
     */
    protected LogManager $logger;

    /**
     * Used to save errors while validation process.
     * @var Array $errors
     */
    protected Array $errors;

    /**
     * Atlas instance, used to check db validation.
     * @var Atlas $atlas
     */
    protected Atlas $atlas;

    /**
     * Creates an instance for BaseValidator class
     */
    public function __construct() {
        $this->utils = ValidationUtils::getInstance();
        $this->logger = new LogManager(BaseValidator::class);
        $this->errors = [];
    }

    /**
     * Changes the atlas used instance.
     * @param Atlas $atlas the new atlas instance.
     */
    public function setAtlas(Atlas $atlas): void {
        $this->atlas = $atlas;
    }

    /**
     * validates a object data.
     * @param $data data to validate.
     */
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