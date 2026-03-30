<?php 
    use App\Controllers\RouterController;
    include_once 'app/Controllers/RouterController.php';
    $router = new RouterController($_GET['route'] ?? 'doctors');

?>