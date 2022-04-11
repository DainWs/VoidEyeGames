<?php
declare(strict_types=1);

namespace classes\CategoriesGame;

use Atlas\Mapper\Record;

/**
 * @method CategoriesGameRow getRow()
 */
class CategoriesGameRecord extends Record
{
    use CategoriesGameFields;
}
