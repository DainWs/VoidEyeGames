<?php
declare(strict_types=1);

namespace classes\User;

use Atlas\Mapper\MapperRelationships;

class UserRelationships extends MapperRelationships
{
    protected function define()
    {
        $this->oneToMany('comments', \classes\Comment\Comment::class, ['id' => 'usersId']);
    }
}
