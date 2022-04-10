<?php

namespace src\services\db;

use DBTable;
use Exception;
use Monolog\Logger;
use PDO;
use src\models\Comments;

/**
 * Esta clase representa la tabla Comments de la base de datos,
 * hay que resaltar que algunos metodos no tendran comentarios dado 
 * que ya los heredan de los metodos del padre.
 */
class DBComments extends DBTable {

    public function query(String $name = "", String $order = 'id', String $orderType = SQL_ORDER_ASC): array|false {
        $result = [];
        try {
            $statement = parent::$connection->prepare("SELECT * FROM Comments ORDER BY :fieldOrder :orderType");
            $statement->bindParam(":fieldOrder", $order);
            $statement->bindParam(":orderType", $orderType);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_CLASS, Comments::class);
        } catch(Exception $ex) {
            $this->errors = $ex->getMessage();
            $result = false;
        }
        return $result;
    }

    public function queryWith($id): array|false {
        $result = [];
        try {
            $statement = parent::$connection->prepare("SELECT * FROM Comments WHERE id=:id");
            $statement->bindParam(':id', $id);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_CLASS, Comments::class);
        } catch(Exception $ex) {
            $this->errors = $ex->getMessage();
            $result = false;
        }
        return $result;
    }

    public function queryWhereUser($id): array|false {
        $result = [];
        try {
            $statement = parent::$connection->prepare("SELECT * FROM Comments WHERE usuario_id=:id");
            $statement->bindParam(':id', $id);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_CLASS, Comments::class);

            $booksTable = new DBTableBooks();
            foreach ($result as $key => $comment) {
                $result[$key]->libro = $booksTable->queryWith($comment->libro_id)[0];
            }
        } catch(Exception $ex) {
            $this->errors = $ex->getMessage();
            $result = false;
        }
        return $result;
    }

    public function insert($comment): bool {
        $result = true;

        if ($comment instanceof Comments) {
            try {
                $statement = parent::$connection->prepare("INSERT INTO Comments VALUES (:id, :userId, :gamesId, :description)");
                $statement->bindParam(":id", $comment->id);
                $statement->bindParam(":userId", $comment->userId);
                $statement->bindParam(":gamesId", $comment->gamesId);
                $statement->bindParam(":description", $comment->description);
                parent::$connection->beginTransaction();
                $statement->execute();
                parent::$connection->commit();
            } catch (Exception $ex) {
                echo $ex->getMessage();
                $this->errors = $ex->getMessage();
                $result = false;
            }
        }
        return $result;
    }
    
    public function update($comment): bool {
        // Action not allowed
        return false;
    }

    public function delete($id): bool {
        // Action not allowed
        return false;
    }

    public function deleteWhere($id): bool {
        // Action not allowed
        return true;
    }

}