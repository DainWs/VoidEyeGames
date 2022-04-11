<?php
declare(strict_types=1);

namespace classes\Category;

use Atlas\Mapper\Mapper;
use Atlas\Table\Row;

/**
 * @method CategoryTable getTable()
 * @method CategoryRelationships getRelationships()
 * @method CategoryRecord|null fetchRecord($primaryVal, array $with = [])
 * @method CategoryRecord|null fetchRecordBy(array $whereEquals, array $with = [])
 * @method CategoryRecord[] fetchRecords(array $primaryVals, array $with = [])
 * @method CategoryRecord[] fetchRecordsBy(array $whereEquals, array $with = [])
 * @method CategoryRecordSet fetchRecordSet(array $primaryVals, array $with = [])
 * @method CategoryRecordSet fetchRecordSetBy(array $whereEquals, array $with = [])
 * @method CategorySelect select(array $whereEquals = [])
 * @method CategoryRecord newRecord(array $fields = [])
 * @method CategoryRecord[] newRecords(array $fieldSets)
 * @method CategoryRecordSet newRecordSet(array $records = [])
 * @method CategoryRecord turnRowIntoRecord(Row $row, array $with = [])
 * @method CategoryRecord[] turnRowsIntoRecords(array $rows, array $with = [])
 */
class Category extends Mapper
{
}
