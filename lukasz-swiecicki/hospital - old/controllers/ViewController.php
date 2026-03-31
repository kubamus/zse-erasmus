<?php
namespace App\Ciontrollers;

class ViewControllers
{
    private $viewsPath;

    public function __construct()
    {
        $this->viewviewsPath = 'app/Views';
    }

    public function renderView($)
    {
        return $this->viewsPath . $view.'.php';
    }

}