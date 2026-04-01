<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;

class DoctorsController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new Doctor();
    }
    public function index()
    {
        $doctors = $this->model->with('specialization')->get();
        return view('doctors.doctors', compact('doctors'));
    }
}
