<?php
declare(strict_types=1);

namespace classes\Plataform;

use Atlas\Mapper\RecordSet;

/**
 * @method PlataformRecord offsetGet($offset)
 * @method PlataformRecord appendNew(array $fields = [])
 * @method PlataformRecord|null getOneBy(array $whereEquals)
 * @method PlataformRecordSet getAllBy(array $whereEquals)
 * @method PlataformRecord|null detachOneBy(array $whereEquals)
 * @method PlataformRecordSet detachAllBy(array $whereEquals)
 * @method PlataformRecordSet detachAll()
 * @method PlataformRecordSet detachDeleted()
 */
class PlataformRecordSet extends RecordSet
{
}
