<?php

namespace app\Models;

require_once __DIR__ . '/../Database.php';

use app\Database;
use PDO;

class Doctor
{
    private $conn;

    public function __construct()
    {
        $this->conn = (new Database())->getConnection();
    }

    public function index(){

        $queryDoctors = "SELECT * from doctors";

        $stmtDoctors = $this->conn->prepare($queryDoctors);

        $stmtDoctors->execute();

        return $stmtDoctors->fetchAll(PDO::FETCH_OBJ);


    }


}