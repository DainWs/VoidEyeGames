<?php

namespace src\services\db;

use DBTable;
use Exception;
use Monolog\Logger;
use PDO;
use src\models\Usuarios;

/**
 * Esta clase representa la tabla Usuarios de la base de datos,
 * hay que resaltar que algunos metodos no tendran comentarios dado 
 * que ya los heredan de los metodos del padre.
 */
class DBTableUsuarios extends DBTable {

    public function query(String $name = "", String $order = 'id', String $orderType = SQL_ORDER_ASC): array|false {
        $result = [];
        try {
            $statement = parent::$connection->prepare("SELECT * FROM usuarios WHERE nombre LIKE '%$name%' ORDER BY :fieldOrder :orderType");
            $statement->bindParam(":fieldOrder", $order);
            $statement->bindParam(":orderType", $orderType);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_CLASS, Usuarios::class);
            
            $prestamosTable = new DBTablePrestamos();
            foreach ($result as $key => $user) {
                $result[$key]->prestamos = $prestamosTable->queryWhereUser($user->id);
            }
        } catch(Exception $ex) {
            $this->errors = $ex->getMessage();
            $result = false;
        }
        return $result;
    }

    public function queryWith($id): array|false {
        return $this->queryWhere('usuarios', 'id', $id, Usuarios::class);
    }

    /**
     * Found user in db by Dni
     * @param $value the user Dni
     * @return array|false array if all was success, otherwise false
     */
    public function queryWhereDni($value): array|false {
        return $this->queryWhere('usuarios', 'dni', $value, Usuarios::class);
    }

    public function insert($usuario): bool {
        $result = true;

        if ($usuario instanceof Usuarios) {
            try {
                $fecha = date($usuario->birthday->format('Y-m-d'));

                $statement = parent::$connection->prepare("INSERT INTO usuarios VALUES (:id, :nombre, :apellidos, :dni, :domicilio, :poblacion, :provincia, :birthday)");
                $statement->bindParam(":id", $usuario->id);
                $statement->bindParam(":nombre", $usuario->nombre);
                $statement->bindParam(":apellidos", $usuario->apellidos);
                $statement->bindParam(":dni", $usuario->dni);
                $statement->bindParam(":domicilio", $usuario->domicilio);
                $statement->bindParam(":poblacion", $usuario->poblacion);
                $statement->bindParam(":provincia", $usuario->provincia);
                $statement->bindParam(":birthday", $fecha);
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
    
    public function update($usuario): bool {
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