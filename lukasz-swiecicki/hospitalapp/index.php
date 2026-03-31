<?php

use App\Controllers\RouterController;

include_once "app/Controllers/RouterController.php";

$route = $_GET['route'] ?? 'doctors';

$router = new RouterController($route);
