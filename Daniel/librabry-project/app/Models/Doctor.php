<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Doctor extends Model
{
    protected $table = 'doctors';

    protected $fillable = [
        'name',
        'lastname',
        'phone_number',
        'department_id',
        'specialization_id',
    ];

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(Specialization::class, 'specialization_id');
    }
}
