<?php
namespace src\validators;

use src\libraries\LogManager;

abstract class BaseValidator {
    protected LogManager $logger;
    protected Array $errors;

    public function __construct() {
        $this->logger = new LogManager(BaseValidator::class);
        $this->errors = [];
    }

    public abstract function validate($data): void;

    public function getErrors(): Array {
        return $this->errors;
    }

    public function hasErrors(): bool {
        return (count($this->errors) > 0);
    }
}