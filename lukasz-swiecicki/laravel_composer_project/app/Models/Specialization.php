<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    protected $table = 'specializations';
    protected $fillable = [
        'id', 'name'
    ];

    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }
}
