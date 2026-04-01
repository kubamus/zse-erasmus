<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Specialization;

class SpecializationController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new Specialization();
    }
    public function index()
    {
        $specializations = $this->model->get();
        return view('specializations.specialization', compact('specializations'));

    }
}
