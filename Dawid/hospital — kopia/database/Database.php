<?php

class Database { 

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
            
            // Konfiguracja PDO, aby wyrzucało wyjątki w przypadku błędnych zapytań SQL
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch (PDOException $e) {
            // Zatrzymujemy działanie skryptu (die) zamiast tylko wypisywać błąd.
            // Dzięki temu unikniesz błędu "Call to a member function prepare() on null".
            die("<strong>Krytyczny błąd:</strong> Nie można połączyć się z bazą danych. Upewnij się, że baza '" . $this->db . "' istnieje w phpMyAdmin.<br><br>Szczegóły błędu: " . $e->getMessage());
        }

        return $this->conn;
    }

    public function __destruct() {
        $this->conn = null;
    }
}

?>