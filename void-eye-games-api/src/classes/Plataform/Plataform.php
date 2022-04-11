<?php
declare(strict_types=1);

namespace classes\Plataform;

use Atlas\Mapper\Mapper;
use Atlas\Table\Row;

/**
 * @method PlataformTable getTable()
 * @method PlataformRelationships getRelationships()
 * @method PlataformRecord|null fetchRecord($primaryVal, array $with = [])
 * @method PlataformRecord|null fetchRecordBy(array $whereEquals, array $with = [])
 * @method PlataformRecord[] fetchRecords(array $primaryVals, array $with = [])
 * @method PlataformRecord[] fetchRecordsBy(array $whereEquals, array $with = [])
 * @method PlataformRecordSet fetchRecordSet(array $primaryVals, array $with = [])
 * @method PlataformRecordSet fetchRecordSetBy(array $whereEquals, array $with = [])
 * @method PlataformSelect select(array $whereEquals = [])
 * @method PlataformRecord newRecord(array $fields = [])
 * @method PlataformRecord[] newRecords(array $fieldSets)
 * @method PlataformRecordSet newRecordSet(array $records = [])
 * @method PlataformRecord turnRowIntoRecord(Row $row, array $with = [])
 * @method PlataformRecord[] turnRowsIntoRecords(array $rows, array $with = [])
 */
class Plataform extends Mapper
{
}
