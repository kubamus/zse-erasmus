<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Xavier',
            'lastname' => 'Xavier',
            'phone_number' => '123456789',
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Simon',
            'lastname' => 'Simon',
            'phone_number' => '123456789',
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'David',
            'lastname' => 'David',
            'phone_number' => '123456789',
            'department_id' => 1,
            'specialization_id' => 3,
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
            'name' => 'Luca',
            'lastname' => 'Luca',
            'phone_number' => '123456789',
            'department_id' => 3,
            'specialization_id' => 2,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Daniel',
            'lastname' => 'Daniel',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Teodore',
            'lastname' => 'Teodore',
            'phone_number' => '123456789',
            'department_id' => 2,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Maya',
            'lastname' => 'Maya',
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
            'department_id' => 1,
            'specialization_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Victor',
            'lastname' => 'Victor',
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
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Michael',
            'lastname' => 'Michael',
            'phone_number' => '2532362432',
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Daniel',
            'lastname' => 'Daniel',
            'phone_number' => '123456789',
            'department_id' => 1,
            'specialization_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('doctors')->insert([
            'name' => 'Nicholas',
            'lastname' => 'Nicholas',
            'phone_number' => '346374732',
            'department_id' => 3,
            'specialization_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
