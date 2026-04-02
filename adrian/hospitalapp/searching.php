<?php

include_once "database/Database.php";

$con = new Database();

$con = $con->getConnection();

$search = isset($_POST['query']) ? trim($_POST['query']) : '';

if (!empty($search)) {
    try {

        $sql = "SELECT * FROM doctors       
                WHERE MATCH(name, lastname) 
                AGAINST(:query IN BOOLEAN MODE)
                LIMIT 20";

        $stmt = $con->prepare($sql);

        $stmt->execute(['query' => $search . '*']);

        $results = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($results) {
            foreach ($results as $row) {
                echo "<tr>
                        <td>
                            <a href='#'>Editar</a> <a href='#'>Copiar</a> <a href='#'>Borrar</a>
                        </td>
                        <td>{$row->id}</td>
                        <td>{$row->name}</td>
                        <td>{$row->lastname}</td>
                        <td>{$row->phone_number}</td>
                        <td>{$row->departments_id}</td>
                        <td>{$row->specializations_id}</td>
                        <td>{$row->created_at}</td>
                      </tr>";
            }
        } else {
            echo "<tr><td colspan='8' class='text-center'>No results</td></tr>";
        }
    } catch (PDOException $e) {
        echo "<tr><td colspan='8'>Error en la búsqueda: " . $e->getMessage() . "</td></tr>";
    }
}

