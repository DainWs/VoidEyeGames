<?php
/**
 * File: PlataformValidator.php
 * Purpose: Validates plataforms objects.
 * DB Access: Si (Checkea existencia de objeto)
 * Uses files:
 *  - src\validators\BaseValidator.php
 * Used from:
 *  - src\controllers\InsertController.php
 */
namespace src\validators;

use classes\Plataform\Plataform;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

/**
 * A validator class for plataforms objects
 * @uses BaseValidator
 */
class PlataformValidator extends BaseValidator {
    /**
     * Validates a plataform object in a Array representation.
     * @param $plataform the plataform object as array.
     */
    public function validate($plataform): void {
        try {
            if ($plataform === null) throw new InvalidArgumentException("Plataform is null, invalid argument");
            if (($plataform['mainImage'] ?? null) == null) {
                $this->errors['mainImage'] = 'La imagen principal es obligatoria.';
            }
            $this->validateName($plataform['name'] ?? null);
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
            $dbPlataform = $this->atlas->select(Plataform::class, ['name' => $name])->fetchRecord();

            if ($dbPlataform !== null) {
                $this->errors['others'] = 'Ya existe una plataforma con este nombre.';
            }
        } else {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        }
    }
}