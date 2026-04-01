<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('doctors')->insert([
            'name' => 'Hubert',
            'lastname' => 'Hubert',
            'phone_number' => '123456789',
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Daniel',
            'lastname' => 'Daniel',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Ksawier',
            'lastname' => 'Ksawier',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 2,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Szymon',
            'lastname' => 'Szymon',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Dawid',
            'lastname' => 'Dawid',
            'phone_number' => '123456789',
            'department_id' => 3,
            'specialization_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Lucas',
            'lastname' => 'Lucas',
            'phone_number' => '123456789',
            'department_id' => 3,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Lucas',
            'lastname' => 'Lucas 2',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Teodor',
            'lastname' => 'Teodor',
            'phone_number' => '123456789',
            'department_id' => 1,
            'specialization_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Maja',
            'lastname' => 'Maja',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 2,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Kuba',
            'lastname' => 'Kuba',
            'phone_number' => '123456789',
            'department_id' => 3,
            'specialization_id' => 2,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Wiktor',
            'lastname' => 'Wiktor',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Maciej',
            'lastname' => 'Maciej',
            'phone_number' => '123456789',
            'department_id' => 3,
            'specialization_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Mikołaj',
            'lastname' => 'Mikołaj',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 2,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
