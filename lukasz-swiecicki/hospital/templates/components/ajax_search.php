<?php
require_once __DIR__ . '/../../database/database.php';
$db = new Database();
$con = $db->getConnection();

$search = isset($_POST['search']) ? $_POST['search'] : '';

$query = "SELECT doctors.*, specialization_has_doctors.specialization_id, departments_has_doctors.departments_id FROM doctors JOIN departments_has_doctors ON departments_has_doctors.doctors_id = doctors.id JOIN specialization_has_doctors ON specialization_has_doctors.doctors_id = doctors.id WHERE name LIKE :search OR lastname LIKE :search";
$stmt = $con->prepare($query);
$stmt->execute(['search' => '%' . $search . '%']);
$doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($doctors) {
    echo '<div class="container" id="doctors_list">
    <div>
        <h2>Doctors List</h2>
    </div>';
    foreach ($doctors as $doctor) {
        echo '
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">'.$doctor['name'].' '.$doctor['lastname'].'</h5>
                    <p class="card-text">
                    specialization: '.$doctor['specialization_id'].'<br>
                    department: '.$doctor['departments_id'].'
                    </p>
                    <a href="#" class="btn btn-primary">send message</a>
                </div>
            </div>';
    }
    echo '</div>';
} else {
    echo '<p class="text-danger">No doctors found.</p>';
}
?>