<?php
require_once __DIR__ . "/../inc/bootstrap.php";
class Database
{
    protected $connection = null;
    public function __construct()
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);
            
            if ( mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");   
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }			
    }
    public function query($query = "" , $params = [])
    {
        try {
            $stmt = $this->executeStatement( $query , $params );
            if(str_starts_with($query, "SELECT")){
                $result = $stmt->get_result()->fetch_all();
                $stmt->close();
                return sizeof($result)===0 ? false : $result;
            }
        } catch(Exception $e) {
            return false;
        }
    }
    private function executeStatement($query = "" , $params = [])
    {
        try {
            $stmt = $this->connection->prepare( $query );
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
            if(sizeof($params)!==0) {
                $stmt->execute($params);
            } else {
                $stmt->execute();
            } 
            return $stmt;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }	
    }
}