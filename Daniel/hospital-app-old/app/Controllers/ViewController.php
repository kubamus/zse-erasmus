<?php

namespace app\Controllers;

class ViewControllers
{
    public  $viewsPath;
    public $header;
    public $footer;

    public function __construct()
    {
        $this->viewsPath = dirname(__DIR__, 1).'/Views/components/';
        $this->header = dirname(__DIR__, 1).'/Views/header.php';
        $this->footer = dirname(__DIR__, 1).'/Views/footer.php';
    }

    public function renderView($view, $data = [])
    {
        if (!empty($data) && is_array($data)) {
            extract($data);
        }
        $viewPath = $this->viewsPath . "{$view}.php";

        if (!file_exists($viewPath)) {
            throw new \Exception("Vista no encontrada: $viewPath");
        }

        require_once $this->header;
        require_once $viewPath;
        require_once $this->footer;
    }
}