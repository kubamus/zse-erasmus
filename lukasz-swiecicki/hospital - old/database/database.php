<?php

class Database { // Poprawiona nazwa

    private $host;
    private $user;
    private $pass;
    private $db;
    private $conn;

    public function __construct() {
        $this->host = "localhost";
        $this->user = "root";  
        $this->pass = "";        
        $this->db   = "hospital";
    }

    public function getConnection() {
        $this->conn = null; 

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->user, $this->pass);

            
        } catch (PDOException $e) {
            echo "Błąd połączenia: " . $e->getMessage();
        }

        return $this->conn;
    }

    public function __destruct() {
        $this->conn = null;
    }
}

?>