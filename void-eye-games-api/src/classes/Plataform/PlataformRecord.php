<?php
declare(strict_types=1);

namespace classes\Plataform;

use Atlas\Mapper\Record;

/**
 * @method PlataformRow getRow()
 */
class PlataformRecord extends Record
{
    use PlataformFields;
}
