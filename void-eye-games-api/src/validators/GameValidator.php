<?php
namespace src\validators;

use Atlas\Orm\Atlas;
use classes\Game\Game;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

class GameValidator extends BaseValidator {
    protected Atlas $atlas;
    protected ValidationUtils $utils;

    public function __construct() {
        parent::__construct();
        $this->utils = ValidationUtils::getInstance();
    }

    public function setAtlas(Atlas $atlas): void {
        $this->atlas = $atlas;
    }

    public function validate($game): void {
        try {
            if ($game === null) throw new InvalidArgumentException("Game is null, invalid argument");
            $this->validateName($game->name);
        } catch(Exception $ex) {
            $this->logger->log($ex->getMessage(), Logger::WARNING);
            $this->errors['others'] = 'Ha ocurrido un error inesperado, intentelo de nuevo mas tarde.';
        }
    }

    private function validateName($name): void {
        if (!$name) {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        } else {
            $dbGame = $this->atlas->select(Game::class, ['name' => $name])->fetchRecord();
            if (!$dbGame) {
                $this->errors['others'] = 'Ya existe un juego con este nombre.';
            }
        }
    }
}