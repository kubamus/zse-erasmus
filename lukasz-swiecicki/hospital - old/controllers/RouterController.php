<?php
    include("app/Controllers/ViewController.php");
    namespace App\Controllers

    class 

    public $route
    public function __construct($route) 
    {
        $this->route = $route;
        switch($this->route) {
            case 'home':
                $views= new ViewControllers('home');
        }
    }
?>