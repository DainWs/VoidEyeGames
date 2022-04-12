<?php
declare(strict_types=1);

namespace classes\Comment;

use Atlas\Mapper\MapperRelationships;

class CommentRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->manyToOne('games', \classes\Game\Game::class, ['gamesId' => 'id']);
        $this->manyToOne('users', \classes\User\User::class, ['usersId' => 'id']);
    }
}
