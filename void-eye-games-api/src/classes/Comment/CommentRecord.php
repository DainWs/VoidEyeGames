<?php
declare(strict_types=1);

namespace classes\Comment;

use Atlas\Mapper\Record;

/**
 * @method CommentRow getRow()
 */
class CommentRecord extends Record
{
    use CommentFields;
}
