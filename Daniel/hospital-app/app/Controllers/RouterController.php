<?php 
    namespace App\Controllers;
    require_once __DIR__ . '/ViewController.php';
    
    use App\Controllers\ViewController;

    class RouterController {
    public $route;
    public $viewController;

     public function __construct($route) {
        $this->route = $route;
        $this->viewController = new ViewController();

        $safeRoute = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$this->route);
        $viewPath = $this->viewController->renderView('components/' . $safeRoute);

        if (is_file($viewPath)) {
            include $this->viewController->renderView('header');
            include $viewPath;
            include $this->viewController->renderView('footer');
            return;
        }

        http_response_code(404);
        echo 'Route not found';
     }
    }
?>