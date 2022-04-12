<?php
declare(strict_types=1);

namespace classes\Category;

use Atlas\Mapper\MapperRelationships;

class CategoryRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->oneToMany('categories_games', \classes\CategoriesGame\CategoriesGame::class, ['id' => 'categoriesId']);
        $this->manyToMany('games', \classes\Game\Game::class, 'categories_games');
    }
}
