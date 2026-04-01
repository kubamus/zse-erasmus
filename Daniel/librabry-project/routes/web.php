<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorsController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\SpecializationController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('doctors', [DoctorsController::class, 'index'])->name('doctors.index');
Route::get('departments', [DepartmentsController::class, 'index'])->name('departments.index');
Route::get('specializations', [SpecializationController::class, 'index'])->name('specializations.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


use App\Http\Controllers\ProductController;

Route::resource('products', ProductController::class);
Route::get('doctors', [DoctorsController::class, 'index'])->name('doctors.index');
Route::get('departments', [DepartmentsController::class, 'index'])->name('departments.index');
Route::get('specializations', [SpecializationController::class, 'index'])->name('specializations.index');