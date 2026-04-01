<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecializationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('specializations')->insert([
            'specialization' => 'Cardiologist',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('specializations')->insert([
            'specialization' => 'Neurologist',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('specializations')->insert([
            'specialization' => 'Pediatrician',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('specializations')->insert([
            'specialization' => 'Oncologist',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('specializations')->insert([
            'specialization' => 'Orthopedist',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

            DB::table('specializations')->insert([
                'specialization' => 'Dermatologist',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            DB::table('specializations')->insert([
                'specialization' => 'Psychiatrist',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
    }
}
