<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Specialization;

class SpecializationsController extends Controller
{
    public function index()
    {
        $specializations = Specialization::all();

        return view('specializations.specializations', compact('specializations'));
    }
}
