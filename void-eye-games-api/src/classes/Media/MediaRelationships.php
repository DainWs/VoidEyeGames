<?php
declare(strict_types=1);

namespace classes\Media;

use Atlas\Mapper\MapperRelationships;

class MediaRelationships extends MapperRelationships
{
    protected function define()
    {
        //$this->manyToOne('games', \classes\Game\Game::class, ['gamesId' => 'id']);
    }
}
