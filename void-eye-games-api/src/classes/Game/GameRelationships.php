<?php
declare(strict_types=1);

namespace classes\Game;

use Atlas\Mapper\MapperRelationships;

class GameRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->oneToMany('medias', \classes\Media\Media::class, ['id' => 'gamesId']);

        $this->oneToMany('plataforms_games', \classes\PlataformsGame\PlataformsGame::class, ['id' => 'plataformsId']);
        $this->manyToMany('plataforms', \classes\Plataform\Plataform::class, 'plataforms_games');

        $this->oneToMany('categories_games', \classes\CategoriesGame\CategoriesGame::class, ['id' => 'gamesId']);
        $this->manyToMany('categories', \classes\Category\Category::class, 'categories_games');

        $this->oneToMany('comments', \classes\Comment\Comment::class, ['id' => 'gamesId']);
    }
}
