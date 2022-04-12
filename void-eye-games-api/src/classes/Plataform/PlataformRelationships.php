<?php
declare(strict_types=1);

namespace classes\Plataform;

use Atlas\Mapper\MapperRelationships;

class PlataformRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->oneToMany('plataforms_games', \classes\PlataformsGame\PlataformsGame::class, ['id' => 'plataformsId']);
        $this->manyToMany('games', \classes\Game\Game::class, 'plataforms_games');
    }
}
