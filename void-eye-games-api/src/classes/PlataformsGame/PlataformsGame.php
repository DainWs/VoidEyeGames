<?php
declare(strict_types=1);

namespace classes\PlataformsGame;

use Atlas\Mapper\Mapper;
use Atlas\Table\Row;

/**
 * @method PlataformsGameTable getTable()
 * @method PlataformsGameRelationships getRelationships()
 * @method PlataformsGameRecord|null fetchRecord($primaryVal, array $with = [])
 * @method PlataformsGameRecord|null fetchRecordBy(array $whereEquals, array $with = [])
 * @method PlataformsGameRecord[] fetchRecords(array $primaryVals, array $with = [])
 * @method PlataformsGameRecord[] fetchRecordsBy(array $whereEquals, array $with = [])
 * @method PlataformsGameRecordSet fetchRecordSet(array $primaryVals, array $with = [])
 * @method PlataformsGameRecordSet fetchRecordSetBy(array $whereEquals, array $with = [])
 * @method PlataformsGameSelect select(array $whereEquals = [])
 * @method PlataformsGameRecord newRecord(array $fields = [])
 * @method PlataformsGameRecord[] newRecords(array $fieldSets)
 * @method PlataformsGameRecordSet newRecordSet(array $records = [])
 * @method PlataformsGameRecord turnRowIntoRecord(Row $row, array $with = [])
 * @method PlataformsGameRecord[] turnRowsIntoRecords(array $rows, array $with = [])
 */
class PlataformsGame extends Mapper
{
}
