<?php
declare(strict_types=1);

namespace classes\Media;

use Atlas\Mapper\Record;

/**
 * @method MediaRow getRow()
 */
class MediaRecord extends Record
{
    use MediaFields;
}
