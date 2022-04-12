<?php
declare(strict_types=1);

namespace classes\PlataformsGame;

use Atlas\Mapper\MapperRelationships;

class PlataformsGameRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->manyToOne('games', \classes\Game\Game::class, ['gamesId' => 'id']);
        $this->manyToOne('plataforms', \classes\Plataform\Plataform::class, ['plataformsId' => 'id']);
    }
}
