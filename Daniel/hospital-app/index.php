<?php
    include_once('./templates/header.php');
    include_once('./templates/components/navigation.php');
    include_once('./database/Database.php');

    $connection = new Database();
    $conn = $connection->connect();
?>

    <main class="container my-4 mx-auto d-flex justify-content-center align-items-center" style="height: 100vh;">
        <h1>Welcome to the Hospital of Daniel Polus</h1>
    </main>

<?php 
    include_once('./templates/components/doctors.php');
    include_once('./templates/footer.php') 
?>