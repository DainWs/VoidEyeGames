<?php

/**
 * This file was generated by Atlas. Changes will be overwritten.
 */

declare(strict_types=1);

namespace classes\CategoriesGame;

use Atlas\Table\Table;

/**
 * @method CategoriesGameRow|null fetchRow($primaryVal)
 * @method CategoriesGameRow[] fetchRows(array $primaryVals)
 * @method CategoriesGameTableSelect select(array $whereEquals = [])
 * @method CategoriesGameRow newRow(array $cols = [])
 * @method CategoriesGameRow newSelectedRow(array $cols)
 */
class CategoriesGameTable extends Table
{
    const DRIVER = 'mysql';

    const NAME = 'categories_games';

    const COLUMNS = [
        'categoriesId' => array(
            'name' => 'categoriesId',
            'type' => 'int',
            'size' => 10,
            'scale' => 0,
            'notnull' => true,
            'default' => NULL,
            'autoinc' => false,
            'primary' => true,
            'options' => NULL,
        ),
        'gamesId' => array(
            'name' => 'gamesId',
            'type' => 'int',
            'size' => 10,
            'scale' => 0,
            'notnull' => true,
            'default' => NULL,
            'autoinc' => false,
            'primary' => true,
            'options' => NULL,
        ),
    ];

    const COLUMN_NAMES = [
        'categoriesId',
        'gamesId',
    ];

    const COLUMN_DEFAULTS = [
        'categoriesId' => null,
        'gamesId' => null,
    ];

    const PRIMARY_KEY = [
        'categoriesId',
        'gamesId',
    ];

    const AUTOINC_COLUMN = null;

    const AUTOINC_SEQUENCE = null;
}
