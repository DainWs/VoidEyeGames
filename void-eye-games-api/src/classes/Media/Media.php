<?php
declare(strict_types=1);

namespace classes\Media;

use Atlas\Mapper\Mapper;
use Atlas\Table\Row;

/**
 * @method MediaTable getTable()
 * @method MediaRelationships getRelationships()
 * @method MediaRecord|null fetchRecord($primaryVal, array $with = [])
 * @method MediaRecord|null fetchRecordBy(array $whereEquals, array $with = [])
 * @method MediaRecord[] fetchRecords(array $primaryVals, array $with = [])
 * @method MediaRecord[] fetchRecordsBy(array $whereEquals, array $with = [])
 * @method MediaRecordSet fetchRecordSet(array $primaryVals, array $with = [])
 * @method MediaRecordSet fetchRecordSetBy(array $whereEquals, array $with = [])
 * @method MediaSelect select(array $whereEquals = [])
 * @method MediaRecord newRecord(array $fields = [])
 * @method MediaRecord[] newRecords(array $fieldSets)
 * @method MediaRecordSet newRecordSet(array $records = [])
 * @method MediaRecord turnRowIntoRecord(Row $row, array $with = [])
 * @method MediaRecord[] turnRowsIntoRecords(array $rows, array $with = [])
 */
class Media extends Mapper
{
}
