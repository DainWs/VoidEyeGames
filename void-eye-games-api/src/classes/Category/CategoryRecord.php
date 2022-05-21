<?php

declare(strict_types=1);

namespace classes\Category;

use Atlas\Mapper\Record;
use Atlas\Orm\Atlas;
use classes\CategoriesGame\CategoriesGame;
use classes\CategoriesGame\CategoriesGameRecordSet;
use src\domain\exceptions\AppException;

/**
 * @method CategoryRow getRow()
 * @property mixed $id
 * @property mixed $name
 * @property CategoriesGameRecordSet $categories_games
 */
class CategoryRecord extends Record
{
    use CategoryFields;

    public function addCategoryGame(Array $categoriesGames, Atlas $atlas) {
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);
        
        $categoriesGames['categoriesId'] =  $this->id;
        $categoriesGames['games'] = null;
        $categoriesGames['categories'] = null;
        $this->categories_games->appendNew($categoriesGames);
    }

    public function update(Array $updatedCategory, Atlas $atlas)
    {
        $this->updateName($updatedCategory['name'] ?? null, $atlas);
        $this->updateCategoriesGames($updatedCategory['categories_games'] ?? null, $atlas);
    }

    public function updateName(?string $name, Atlas $atlas)
    {
        if (!$name || empty($name)) return;
        $searchedCategory = $atlas->select(Category::class, ['name' => $name])->where('id !=', $this->id)->fetchRecord();
        if ($searchedCategory) throw new AppException('There is already a category with this name.');
        $this->name = $name;
    }

    public function updateCategoriesGames(?Array $categoriesGames, Atlas $atlas) {
        if (!$categoriesGames) return;
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);

        $this->categories_games->setDelete();
        foreach ($categoriesGames as $categoryGame) {
            $record = $this->categories_games->getOneBy(['gamesId' => $categoryGame['gamesId']]);
            if ($record) $record->setDelete(false);
            else $this->addCategoryGame($categoryGame, $atlas);
        }
    }
}
