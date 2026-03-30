<?php 
    include_once "scripts/database.php";

    $database = new Database();
    $conn = $database->conn;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
    </script>
    <title>Hospital of Daniel</title>
</head>

<body>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Hospital of Daniel</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Appointments</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Chat with doctor</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            My space
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Medical records</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5 bg-light p-5 rounded">

        <h1>Personal Data</h1>
        <?php 
            $personalData = $conn->query("SELECT * FROM patients WHERE id = 1");
            foreach ($personalData->fetchAll(PDO::FETCH_ASSOC) as $data) {
                echo "<h4>Name: " . htmlspecialchars($data['name']) . "</h4>";
            }

        ?>
    </div>
    <div class="container mt-5 bg-light p-5 rounded">
        <h2>Treatment Plans</h2>
        <?php 
    $treatments = $conn->query("SELECT * FROM treatments");
    foreach ($treatments->fetchAll(PDO::FETCH_ASSOC) as $treatment) {
        echo "<table class='table table-striped'>";
        echo "<tr><td class='form-label'>" . htmlspecialchars($treatment['description']) . "</td><td class='form-control'>" . htmlspecialchars($treatment['start_date']) . " - " . htmlspecialchars($treatment['end_date']) . "</td></tr>";
        echo "</table>";
    }
?>
    </div>


</html>