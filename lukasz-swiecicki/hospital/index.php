    <?php include_once("templates/head.php") ?>
    <?php include_once("database/database.php") ?>
    
    <?php 
    $connection = (new Database())->getConnection();

    ?>

    <header>
        <a href="index.php">
            <h1>Hospital</h1>
        </a>
    </header>
    <?php include_once("templates/components/navigation.php") ?>
    <main class="container my-4 mx-auto justify-content-center">
            <?php include_once("templates/components/doctors.php") ?>
    </main>



    <?php include_once("templates/footer.php") ?>