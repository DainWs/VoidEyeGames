<?php
declare(strict_types=1);

namespace classes\Media;

use Atlas\Mapper\RecordSet;

/**
 * @method MediaRecord offsetGet($offset)
 * @method MediaRecord appendNew(array $fields = [])
 * @method MediaRecord|null getOneBy(array $whereEquals)
 * @method MediaRecordSet getAllBy(array $whereEquals)
 * @method MediaRecord|null detachOneBy(array $whereEquals)
 * @method MediaRecordSet detachAllBy(array $whereEquals)
 * @method MediaRecordSet detachAll()
 * @method MediaRecordSet detachDeleted()
 */
class MediaRecordSet extends RecordSet
{
}
