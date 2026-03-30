<?php

namespace app\Controllers;

require_once __DIR__ . '/../Models/Doctor.php';
require_once __DIR__ . '/../Controllers/ViewControllers.php';

use app\Models\Doctor;
use App\Controllers\ViewControllers;

class DoctorController
{
    public $model;
    public $viewController;

    public function __construct(){
        $this->model = new Doctor();
        $this->viewController = new ViewControllers();

    }

    public function index()
    {
        $doctors = $this->model->index();
        $this->viewController->renderView('doctors', ['doctors' => $doctors]);
    }
}