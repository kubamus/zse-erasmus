<?php

namespace app;
use PDO;
use PDOException;

class Database {

    private $host;
    private $user;
    private $pass;
    private $db;
    private $conn;

    public function __construct() {
        $this->host = "database";
        $this->user = "testing";
        $this->pass = "testing";
        $this->db = "hospital";

    }

    public function getConnection() {

        try {

             return $this->conn = new PDO("mysql:host=$this->host;
                dbname=$this->db",
                $this->user,
                $this->pass);

        }catch(PDOException $e) {
            return $e->getMessage();
        }


    }

    public function __destruct() {
        unset($this->conn);
    }
}