<?php
namespace src\validators;

use Atlas\Orm\Atlas;
use classes\Category\Category;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

/**
 * A validator class for category objects
 */
class CategoryValidator extends BaseValidator {
    protected Atlas $atlas;
    protected ValidationUtils $utils;

    public function __construct() {
        parent::__construct();
        $this->utils = ValidationUtils::getInstance();
    }

    public function setAtlas(Atlas $atlas): void {
        $this->atlas = $atlas;
    }

    public function validate($category): void {
        try {
            if ($category === null) throw new InvalidArgumentException("Category is null, invalid argument");
            $this->validateName($category['name'] ?? null);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    private function validateName($name): void {
        if ($name === null || empty($name)) {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        } else {
            $dbCategory = $this->atlas->select(Category::class, ['name' => $name])->fetchRecord();
            if ($dbCategory !== null) {
                $this->errors['others'] = 'Ya existe una categoria con este nombre.';
            }
        }
    }
}