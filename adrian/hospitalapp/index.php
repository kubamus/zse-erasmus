<?php
    include_once('./templates/header.php');
    include_once('./templates/components/navigation.php');
    include_once ("./database/Database.php");
?>

    <main  class="container my-4  mx-auto d-flex justify-content-center align-items-center">
        <?php
            include_once('./templates/components/doctors.php');
        ?>

    </main>




<?php  include_once('./templates/footer.php'); ?>