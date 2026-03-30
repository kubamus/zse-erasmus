<?php

   $con = (new Database())->getConnection();
   $queryDoctors = "SELECT doc.name, 
        doc.lastname, 
        doc.specializations_id, 
        doc.departments_id,
        dep.id,
        dep.department,
        sp.id,
        sp.specialization
        FROM doctors as doc
        join departments as dep
        on dep.id = doc.departments_id
        join specializations as sp
        on sp.id = doc.specializations_id";
   $stmtDoctors = $con->prepare($queryDoctors);
   $stmtDoctors->execute();
   $doctors = $stmtDoctors->fetchAll(PDO::FETCH_OBJ);

?>


<div class="container">
    <div>
        <form action="" id="searchForm" enctype="application/x-www-form-urlencoded">
            <input type="text" class="form-control search-input" placeholder="Search doctor">
            <button type="submit" class="btn btn-primary flex-grow-1">Find doctor</button>
        </form>
    </div>

    <div>
        <h2>Doctor list</h2>
    </div>

    <?php
        foreach ($doctors as $doctor) {
    ?>
<!--        <div class="my-4">-->
<!--                <div class="card">-->
<!--                    <div class="card-body">-->
<!--                        <h5 class="card-title">--><?php //echo $doctor->name; ?><!-- </h5>-->
<!--                        <p class="card-text">-->
<!--                            specialization: --><?php //echo $doctor->specialization;  ?>
<!--                        </p>-->
<!--                        <p class="card-text">-->
<!--                            department: --><?php //echo $doctor->department; ?>
<!--                        </p>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

    <?php
        }
    ?>
    <div id="no-results"></div>
    <table class="table">
        <thead></thead>
        <tbody id="doctorResults">

        </tbody>
    </table>









</div>

<script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script>

<script>

    $(document).ready(function() {

        $('#searchForm').on('submit', function(e) {
            e.preventDefault();
        });

        $('.search-input').on('keyup', function() {
            let query = $(this).val();

            if (query.length > 1) {
                $.ajax({
                    url: 'searching.php',
                    method: 'POST',
                    data: { query: query },
                    success: function(response) {
                        $('#doctorResults').html(response);
                    }
                });
            } else if (query === "") {
                $('#no-results').html('No results found');
            }
        });
    });




</script>