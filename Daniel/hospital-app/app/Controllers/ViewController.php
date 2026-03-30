<?php 
    namespace App\Controllers;

    class ViewController {
        private $pathViews;

        public function __construct() {
            $this->pathViews = dirname(__DIR__) . '/Views/';
        }

        public function renderView($view) {
            return $this->pathViews . $view . '.php';
        }
    }
?>