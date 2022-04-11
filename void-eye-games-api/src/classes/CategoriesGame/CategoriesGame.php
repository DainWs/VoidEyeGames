<?php
declare(strict_types=1);

namespace classes\CategoriesGame;

use Atlas\Mapper\Mapper;
use Atlas\Table\Row;

/**
 * @method CategoriesGameTable getTable()
 * @method CategoriesGameRelationships getRelationships()
 * @method CategoriesGameRecord|null fetchRecord($primaryVal, array $with = [])
 * @method CategoriesGameRecord|null fetchRecordBy(array $whereEquals, array $with = [])
 * @method CategoriesGameRecord[] fetchRecords(array $primaryVals, array $with = [])
 * @method CategoriesGameRecord[] fetchRecordsBy(array $whereEquals, array $with = [])
 * @method CategoriesGameRecordSet fetchRecordSet(array $primaryVals, array $with = [])
 * @method CategoriesGameRecordSet fetchRecordSetBy(array $whereEquals, array $with = [])
 * @method CategoriesGameSelect select(array $whereEquals = [])
 * @method CategoriesGameRecord newRecord(array $fields = [])
 * @method CategoriesGameRecord[] newRecords(array $fieldSets)
 * @method CategoriesGameRecordSet newRecordSet(array $records = [])
 * @method CategoriesGameRecord turnRowIntoRecord(Row $row, array $with = [])
 * @method CategoriesGameRecord[] turnRowsIntoRecords(array $rows, array $with = [])
 */
class CategoriesGame extends Mapper
{
}
