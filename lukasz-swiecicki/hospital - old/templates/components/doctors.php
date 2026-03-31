<?php

    include_once __DIR__ . '/../../database/database.php';

    $con = (new Database())->getConnection();
    $queryDoctors = "SELECT doctors.name, doctors.lastname, specialization_has_doctors.specialization_id, departments_has_doctors.departments_id FROM doctors JOIN departments_has_doctors ON departments_has_doctors.doctors_id = doctors.id JOIN specialization_has_doctors ON specialization_has_doctors.doctors_id = doctors.id";
    $stmtDoctors = $con->prepare($queryDoctors);
    $stmtDoctors->execute();
    $doctors = $stmtDoctors->fetchAll(mode:PDO::FETCH_ASSOC);

?>
<div class="container">
    <input type="text" id="search_doctor" class="form-control" placeholder="Search by name or lastname...">
</div><br>
<div class="container-fluid" id="doctors_list">
    <div>
        <h2>Doctors List</h2>
    </div>

<?php 
foreach ($doctors as $doctor) {
?>

    <div class="doctor">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title"><?php echo $doctor['name']; ?> <?php echo $doctor['lastname']; ?></h5>
                <p class="card-text">
                    specialization: <?php echo $doctor['specialization_id']; ?><br>
                    department: <?php echo $doctor['departments_id']; ?>
                </p>
                <a href="#" class="btn btn-primary">send message</a>
            </div>
        </div>
    </div>
<?php
}
?>
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item disabled">
                <a class="page-link">Previous</a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
                <a class="page-link" href="#">Next</a>
            </li>
        </ul>
    </nav>
</div>

<script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>

<script>
$(document).ready(function() {
    
    $('#search_doctor').on('keyup', function() {
        let value = $(this).val();

        $.ajax({
            url: 'templates/components/ajax_search.php',
            method: 'POST',
            data: { search: value },
            success: function(response) {
                $('#doctors_list').html(response);
            }
        });
    });
});
</script>