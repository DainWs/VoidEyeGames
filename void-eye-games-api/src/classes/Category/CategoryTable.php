<?php

/**
 * This file was generated by Atlas. Changes will be overwritten.
 */

declare(strict_types=1);

namespace classes\Category;

use Atlas\Table\Table;

/**
 * @method CategoryRow|null fetchRow($primaryVal)
 * @method CategoryRow[] fetchRows(array $primaryVals)
 * @method CategoryTableSelect select(array $whereEquals = [])
 * @method CategoryRow newRow(array $cols = [])
 * @method CategoryRow newSelectedRow(array $cols)
 */
class CategoryTable extends Table
{
    const DRIVER = 'mysql';

    const NAME = 'categories';

    const COLUMNS = [
        'id' => array(
            'name' => 'id',
            'type' => 'int',
            'size' => 10,
            'scale' => 0,
            'notnull' => true,
            'default' => NULL,
            'autoinc' => true,
            'primary' => true,
            'options' => NULL,
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'size' => 100,
            'scale' => NULL,
            'notnull' => true,
            'default' => NULL,
            'autoinc' => false,
            'primary' => false,
            'options' => NULL,
        ),
    ];

    const COLUMN_NAMES = [
        'id',
        'name',
    ];

    const COLUMN_DEFAULTS = [
        'id' => null,
        'name' => null,
    ];

    const PRIMARY_KEY = [
        'id',
    ];

    const AUTOINC_COLUMN = 'id';

    const AUTOINC_SEQUENCE = null;
}
