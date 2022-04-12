<?php
declare(strict_types=1);

namespace classes\CategoriesGame;

use Atlas\Mapper\MapperRelationships;

class CategoriesGameRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->manyToOne('games', \classes\Game\Game::class, ['gamesId' => 'id']);
        $this->manyToOne('categories', \classes\Category\Category::class, ['categoriesId' => 'id']);
    }
}
