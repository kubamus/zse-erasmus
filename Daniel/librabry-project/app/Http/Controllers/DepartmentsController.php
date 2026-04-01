<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentsController extends Controller
{
        private $model;

    public function __construct()
    {
        $this->model = new Department();
    }
    public function index()
    {
        $departments = $this->model->get();
        return view('departments.departments', compact('departments'));

    }
}
