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

        switch ($this->route) {
            case 'doctors':
                $viewPath = $this->viewController->renderView('components/doctors');
                if (is_file($viewPath)) {
                    include $this->viewController->renderView('header');
                    include $viewPath;
                    include $this->viewController->renderView('footer');
                }
                break;
            default:
                http_response_code(404);
                echo 'Route not found';
                break;
        }
     }
    }
?>