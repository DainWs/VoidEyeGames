<?php
namespace src\validators;

use Atlas\Orm\Atlas;
use classes\Plataform\Plataform;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;

class PlataformValidator extends BaseValidator {
    protected Atlas $atlas;
    protected ValidationUtils $utils;

    public function __construct() {
        parent::__construct();
        $this->utils = ValidationUtils::getInstance();
    }

    public function setAtlas(Atlas $atlas): void {
        $this->atlas = $atlas;
    }

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

    private function validateName($name): void {
        if ($name === null || empty($name)) {
            $this->errors['name'] = 'El campo "name" es obligatorio.';
        } else {
            $dbPlataform = $this->atlas->select(Plataform::class, ['name' => $name])->fetchRecord();
            if ($dbPlataform !== null) {
                $this->errors['others'] = 'Ya existe una plataforma con este nombre.';
            }
        }
    }
}