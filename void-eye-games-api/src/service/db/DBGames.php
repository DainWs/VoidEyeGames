<?php

namespace src\services\db;

use DBTable;
use Exception;
use Monolog\Logger;
use PDO;
use src\models\Games;

/**
 * Esta clase representa la tabla Games de la base de datos,
 * hay que resaltar que algunos metodos no tendran comentarios dado 
 * que ya los heredan de los metodos del padre.
 */
class DBGames extends DBTable {

    public function query(String $name = "", String $order = 'id', String $orderType = SQL_ORDER_ASC): array|false {
        $result = [];
        try {
            $selectedName = "%$name%";
            $statement = parent::$connection->prepare("SELECT * FROM Games WHERE name LIKE :name ORDER BY :fieldOrder :orderType");
            $statement->bindParam(":name", $selectedName);
            $statement->bindParam(":fieldOrder", $order);
            $statement->bindParam(":orderType", $orderType);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_CLASS, Games::class);
        } catch(Exception $ex) {
            echo $ex->getMessage();
            $this->errors = $ex->getMessage();
            $result = false;
        }
        return $result;
    }
    
    public function queryWith($id): array|false {
        return $this->queryWhere('Games', 'id', $id, Games::class);
    }

    public function insert($game): bool {
        
        return false;
    }
    
    public function update($game): bool {
        
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