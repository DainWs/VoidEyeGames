<?php
declare(strict_types=1);

namespace classes\Category;

use Atlas\Mapper\RecordSet;

/**
 * @method CategoryRecord offsetGet($offset)
 * @method CategoryRecord appendNew(array $fields = [])
 * @method CategoryRecord|null getOneBy(array $whereEquals)
 * @method CategoryRecordSet getAllBy(array $whereEquals)
 * @method CategoryRecord|null detachOneBy(array $whereEquals)
 * @method CategoryRecordSet detachAllBy(array $whereEquals)
 * @method CategoryRecordSet detachAll()
 * @method CategoryRecordSet detachDeleted()
 */
class CategoryRecordSet extends RecordSet
{
}
