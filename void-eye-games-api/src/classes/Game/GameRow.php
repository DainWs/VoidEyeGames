<?php
/**
 * This file was generated by Atlas. Changes will be overwritten.
 */
declare(strict_types=1);

namespace classes\Game;

use Atlas\Table\Row;

/**
 * @property mixed $id int(10,0) NOT NULL
 * @property mixed $name varchar(100) NOT NULL
 * @property mixed $descripcion text(65535)
 */
class GameRow extends Row
{
    protected $cols = [
        'id' => null,
        'name' => null,
        'descripcion' => null,
    ];
}
