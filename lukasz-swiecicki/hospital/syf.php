<div class="container">
        <div class="row">
            <div class="col col-lg-12 col-md-4">
                col1
            </div>
            <div class="col col-lg-6 col-md-8">
                col2
            </div>
            <div class="col col-lg-6">
                col3
            </div>
            <div class="col col-lg-3">
                col4
            </div>
            <div class="col col-lg-3">
                col5
            </div>
            <div class="col col-lg-3">
                col6
            </div>
            <div class="col col-lg-3">
                col7
            </div>
        </div>
    </div>



    <button id="button" class="btn btn-success">Click me</button>

<script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>

<script>
    $(document).ready(function() {
        $('#button').on('click', function() {
            alert('Thanks for the click!');
        });
    });
</script>



<?php use App\Controllers\RouterController;
    include_once "app/Controllers/RouterController.php";
    $route = %_GET['route'] ?? 'home';
    $router = 
    ?>