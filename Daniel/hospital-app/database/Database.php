<?php 
    class Database {
        private $host;
        private $user;
        private $password;
        private $db;

        private $conn;

        public function __construct() {
            $this->host = 'localhost';
            $this->user = 'root';
            $this->password = '';
            $this->db = 'hospital';
        }

        public function connect() {
            try {
                $this->conn = new PDO("mysql:host={$this->host};dbname={$this->db}", $this->user, $this->password);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $this->conn;
            } catch (PDOException $e) {
                echo "Connection failed: " . $e->getMessage();
            }
        }
    }

?>