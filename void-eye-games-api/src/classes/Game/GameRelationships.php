<?php
declare(strict_types=1);

namespace classes\Game;

use Atlas\Mapper\MapperRelationships;

class GameRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->oneToMany('media', \classes\Media\Media::class, ['id' => 'gamesId']);
    }
}
