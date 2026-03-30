<?php
    header('Content-Type: application/json; charset=utf-8');
    include_once('../database/Database.php');

    $conn = (new Database())->connect();
    $doctors = [];
    $name = trim($_GET['name'] ?? '');

    if ($name !== '') {
        $queryDoctors = "
            SELECT
                d.id,
                d.name,
                d.phone_number,
                COALESCE(GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '), '-') AS specializations,
                COALESCE(GROUP_CONCAT(DISTINCT dep.name ORDER BY dep.name SEPARATOR ', '), '-') AS departments
            FROM doctors d
            LEFT JOIN specialization_has_doctors shd ON shd.doctors_id = d.id
            LEFT JOIN specialization s ON s.id = shd.specialization_id
            LEFT JOIN departments_has_doctors dhd ON dhd.doctors_id = d.id
            LEFT JOIN departments dep ON dep.id = dhd.departments_id
            WHERE d.name LIKE :nameLike
            GROUP BY d.id, d.name, d.phone_number
            ORDER BY d.name
        ";
        $stmtDoctors = $conn->prepare($queryDoctors);
        $stmtDoctors->bindValue(':nameLike', "%{$name}%", PDO::PARAM_STR);
        $stmtDoctors->execute();
        $doctors = $stmtDoctors->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($doctors, JSON_UNESCAPED_UNICODE);
?>