<?php

declare(strict_types=1);

namespace classes\Category;

use Atlas\Mapper\Record;

/**
 * @method CategoryRow getRow()
 */
class CategoryRecord extends Record
{
    use CategoryFields;

    public function add(Array $categoriesGames) {
        $categoriesGames['categoriesId'] =  $this->id;
        $this->categories_games->appendNew($categoriesGames);
    }

    public function updateCategoriesGames(Array $categoriesGames) {
        $this->categories_games->setDelete();
        foreach ($categoriesGames as $value) {
            $record = $this->categories_games->getOneBy(['gamesId' => $value['gamesId']]);
            if ($record) {
                $record->setDelete(false);
            } else {
                $record = $this->atlas->newRecord(CategoriesGame::class, $value);
                $this->categories_games->appendNew($value, $record);
            }
        }
    }
}
