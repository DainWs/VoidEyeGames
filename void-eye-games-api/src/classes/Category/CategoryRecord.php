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

    /**
     * Adds a category relationship to this CategoryRecord.
     * @param Array $categoriesGames a list of properties from CategoriesGames objects.
     * @param Atlas $atlas the atlas instance.
     */
    public function addCategoryGame(Array $categoriesGames, Atlas $atlas): void
    {
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);
        
        $categoriesGames['categoriesId'] =  $this->id;
        $categoriesGames['games'] = null;
        $categoriesGames['categories'] = null;
        $this->categories_games->appendNew($categoriesGames);
    }

    /**
     * Updates a category with other Category array representation object.
     * @param Array $updatedCategory a list of properties from Category objects.
     * @param Atlas $atlas the atlas instance.
     * @throws AppException if already exists a category with that name
     */
    public function update(Array $updatedCategory, Atlas $atlas): void
    {
        $this->updateName($updatedCategory['name'] ?? null, $atlas);
        $this->updateCategoriesGames($updatedCategory['categories_games'] ?? null, $atlas);
    }

    /**
     * Updates the category name.
     * @param ?String $name the new name.
     * @param Atlas $atlas the atlas instance.
     * @throws AppException if already exists a category with that name
     */
    public function updateName(?string $name, Atlas $atlas): void
    {
        if (!$name || empty($name)) return;
        $searchedCategory = $atlas->select(Category::class, ['name' => $name])->where('id !=', $this->id)->fetchRecord();
        if ($searchedCategory) throw new AppException('There is already a category with this name.');
        $this->name = $name;
    }

    /**
     * Updates the category relationships.
     * @param ?Array $categoriesGames array of the current new categories relationships, if a relationship is not found here, it means that was deleted.
     * @param Atlas $atlas the atlas instance.
     */
    public function updateCategoriesGames(?Array $categoriesGames, Atlas $atlas): void
    {
        if ($categoriesGames == null) return;
        if (!$this->categories_games) $this->categories_games = $atlas->newRecordSet(CategoriesGame::class);

        $this->categories_games->setDelete();
        foreach ($categoriesGames as $categoryGame) {
            $record = $this->categories_games->getOneBy(['gamesId' => $categoryGame['gamesId']]);
            if ($record) $record->setDelete(false);
            else $this->addCategoryGame($categoryGame, $atlas);
        }
    }
}
