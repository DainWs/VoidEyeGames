<?php
/**
 * File: GameValidator.php
 * Purpose: Validates games objects.
 * DB Access: Si (Checkea existencia de objeto)
 * Uses files:
 *  - src\validators\BaseValidator.php
 * Used from:
 *  - src\controllers\InsertController.php
 */
namespace src\validators;

use classes\Game\Game;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

/**
 * A validator class for game objects
 * @uses BaseValidator
 */
class GameValidator extends BaseValidator {
    /**
     * Validates a Game object in a Array representation.
     * @param $game the Game object as array.
     */
    public function validate($game): void {
        try {
            if ($game === null) throw new InvalidArgumentException("Game is null, invalid argument");
            $this->validateMainImage($game['mainImage'] ?? null);
            $this->validateName($game['name'] ?? null);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    /**
     * Validates mainImage, if found errors, this method 
     * will append its to the $errors array property
     * @param $mainImage the mainImage to validate.
     */
    private function validateMainImage($mainImage): void {
        if ($mainImage == null) {
            $this->errors['mainImage'] = 'La imagen principal es obligatoria.';
        }
    }

    /**
     * Validates name, if found errors, this method 
     * will append its to the $errors array property
     * @param $name the name to validate.
     */
    private function validateName($name): void {
        if ($this->utils->validateNotEmpty($name)) {
            $dbGame = $this->atlas->select(Game::class, ['name' => $name])->fetchRecord();

            if ($dbGame !== null) {
                $this->errors['others'] = 'Ya existe un juego con este nombre.';
            }
        } else {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        }
    }
}