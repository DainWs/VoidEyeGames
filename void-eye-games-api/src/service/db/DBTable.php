<?php

use src\libraries\LogManager;
use src\services\db\DBConnection;

/**
 * Esta clase tabla permite crear una conexion con una tabla especifica y realizar las operaciones tipicas sobre esta,
 * para poder utilizarla, extienda de esta clase
 */
abstract class DBTable extends DBConnection {

    /**
     * Only for internal use. (this method only used by this class)
     * @param $table the table name that is target of this query
     * @param $field the field name that is target of this query
     * @param $value the value espected for the field target
     * @param $toClass the class to which each of the objects will be converted
     * @return array|false array si se realizo de forma correcta, y false en caso contrario
     */
    protected function queryWhere($table, $field, $value, $toClass): array|false {
        $result = [];
        try {
            $statement = parent::$connection->prepare("SELECT * FROM $table WHERE $field = ?");
            $statement->bindParam(1, $value);
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_CLASS, $toClass);
        } catch(Exception $ex) {
            $this->errors = $ex->getMessage();
            $result = false;
        }
        return $result;
    }

    /**
     * Get all rows where match the conditions
     * @param $name the name like param to search for specific data
     * @param $order the column to sort by
     * @param $orderType the type of order, SQL_ORDER_ASC or SQL_ORDER_DES
     * @return array|false array si se realizo de forma correcta, y false en caso contrario
     */
    public abstract function query(
        String $name = "",
        String $order = '',
        String $orderType = SQL_ORDER_ASC
    ): array|false;

    /**
     * Search a specified row where primary key is
     * @param $id the primary key that represent the searched object
     * @return array|false array si se realizo de forma correcta, y false en caso contrario
     */
    public abstract function queryWith($id): array|false;

    /**
     * insert a row
     * @param $rowData the object that will be inserted
     * @return bool true si se realizo de forma correcta, y false en caso contrario
     */
    public abstract function insert($rowData): bool;

    /**
     * updates a row
     * @param $rowData the object that will be updated
     * @return bool true si se realizo de forma correcta, y false en caso contrario
     */
    public abstract function update($rowData): bool;

    /**
     * Delete a row by a primary key
     * @param $id the primary key that represent the searched object
     * @return bool true si se realizo de forma correcta, y false en caso contrario
     */
    public abstract function delete($id): bool;

    /**
     * Delete where match the conditions
     * @param $id the primary key that represent the searched object
     * @return bool true si se realizo de forma correcta, y false en caso contrario
     */
    public abstract function deleteWhere($id): bool;

    /**
     * Count all rows in a table
     * @param $table the name of the table whose rows you want to count
     * @return int the num of rows in the table
     */
    public static function count($table = ''): int {
        $result = 0;
        if (!empty($table)) {
            try {
                $statement = parent::$connection->prepare("SELECT COUNT(*) AS LENGTH FROM $table");
                $statement->execute();
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            } catch(Exception $ex) {
                $result = 0;
            }
        }
        return $result;
    }
}