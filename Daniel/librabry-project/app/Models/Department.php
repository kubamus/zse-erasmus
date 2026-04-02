<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';

    protected $fillable = [
        'department',
    ];

    public function doctor() {
        return $this->hasMany('App\Models\Doctor');
    }
}
