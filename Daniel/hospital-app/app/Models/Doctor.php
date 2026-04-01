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

        $queryDoctors = "SELECT doc.id as docid, doc.name,
        doc.lastname,
        doc.specializations_id,
        doc.departments_id,
        dep.id as depid,
        dep.department,
        sp.id as spid,
        sp.specialization
        FROM doctors as doc
        join departments as dep
        on dep.id = doc.departments_id
        join specializations as sp
        on sp.id = doc.specializations_id";

        $stmtDoctors = $this->conn->prepare($queryDoctors);

        $stmtDoctors->execute();

        return $stmtDoctors->fetchAll(PDO::FETCH_OBJ);
    }
}