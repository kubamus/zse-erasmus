<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'doctors';
    protected $fillable = [
        'name', 'lastname', 'phone_number', 'specialization_id', 'department_id'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class); 
    }

    public function specialization()
    {
        return $this->belongsTo(Specialization::class);
    }
}
