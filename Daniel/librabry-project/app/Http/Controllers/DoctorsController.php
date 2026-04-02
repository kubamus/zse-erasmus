<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Department;
use App\Models\Specialization;

class DoctorsController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new Doctor();
    }
    public function index()
    {
        $doctors = $this->model->with(['specialization', 'department'] )->get();
        $departments = Department::all();
        $specializations = Specialization::all();

        return view('doctors.doctors', compact('doctors', 'departments', 'specializations'));

    }

    public function store(Request $request) {
        $newDoctor = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'lastname' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:45'],
            'specialization_id' => ['nullable', 'exists:specializations,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ]);

        $this->model->create($newDoctor);
        return redirect()->back();
    }
}
