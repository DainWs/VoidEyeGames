<?php
/**
 * File: CategoryValidator.php
 * Purpose: Validates categories objects.
 * DB Access: Si (Checkea existencia de objeto)
 * Uses files:
 *  - src\validators\BaseValidator.php
 * Used from:
 *  - src\controllers\InsertController.php
 */
namespace src\validators;

use classes\Category\Category;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

/**
 * A validator class for category objects
 * @uses BaseValidator
 */
class CategoryValidator extends BaseValidator {
    /**
     * Validates a category object in a Array representation.
     * @param $category the category object as array.
     */
    public function validate($category): void {
        try {
            if ($category === null) throw new InvalidArgumentException("Category is null, invalid argument");
            $this->validateName($category['name'] ?? null);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    /**
     * Validates name, if found errors, this method 
     * will append its to the $errors array property
     * @param $name the name to validate.
     */
    private function validateName($name): void {
        if ($this->utils->validateNotEmpty($name)) {
            $dbCategory = $this->atlas->select(Category::class, ['name' => $name])->fetchRecord();

            if ($dbCategory !== null) {
                $this->errors['others'] = 'Ya existe una categoria con este nombre.';
            }
        } else {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        }
    }
}