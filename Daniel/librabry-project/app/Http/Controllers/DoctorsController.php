<?php

namespace App\Http\Controllers;

use App\Http\Requests\DoctorsRequest;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Specialization;
use Illuminate\Http\Request;

class DoctorsController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new Doctor();
    }

    public function index()
    {
        $doctors = $this->model->with(['specialization', 'department'])->get();
        $departments = Department::all();
        $specializations = Specialization::all();

        return view('doctors.doctors', compact('doctors', 'departments', 'specializations'));
    }

    public function store(DoctorsRequest $request)
    {
        $newDoctor = $request->validated();

        $this->model->create($newDoctor);
        return redirect()->back();
    }

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => ['required', 'integer', 'exists:doctors,id'],
        ]);

        $doctor = $this->model->findOrFail($validated['doctor_id']);
        $doctor->delete();

        return redirect()->back();
    }
}
