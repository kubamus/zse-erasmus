<?php

namespace app\Controllers;

include_once "app/Controllers/ViewControllers.php";
include_once "app/Controllers/DoctorController.php";

use app\Controllers\DoctorController;


class RouterController
{

    public $viewController;

    public function __construct($route)
    {
        $this->viewController = new ViewControllers();

        switch ($route) {

            case 'doctors':
                $controller = new DoctorController();
                $controller->index();
                break;

            case 'patients':
                $this->viewController->renderView('patients');
                break;

            case 'treatments':
                $this->viewController->renderView('treatments');
                break;


        }




    }





}