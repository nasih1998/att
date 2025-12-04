<?php

namespace Database\Seeders;

use App\Models\Lecture;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
        ]);

        // Create lecturer users
        $lecturer1 = User::create([
            'name' => 'Dr. John Smith',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'LECTURER',
        ]);

        $lecturer2 = User::create([
            'name' => 'Dr. Sarah Johnson',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
            'role' => 'LECTURER',
        ]);

        // Create sample students
        Student::create([
            'full_name' => 'Alice Brown',
            'email' => 'alice@student.com',
            'student_number' => 'STU001',
            'active' => true,
        ]);

        Student::create([
            'full_name' => 'Bob Wilson',
            'email' => 'bob@student.com',
            'student_number' => 'STU002',
            'active' => true,
        ]);

        Student::create([
            'full_name' => 'Charlie Davis',
            'email' => 'charlie@student.com',
            'student_number' => 'STU003',
            'active' => true,
        ]);

        // Create sample lectures
        Lecture::create([
            'name' => 'Introduction to Programming',
            'code' => 'CS101',
            'type' => 'THEORY',
            'lecturer_id' => $lecturer1->id,
        ]);

        Lecture::create([
            'name' => 'Programming Lab',
            'code' => 'CS101L',
            'type' => 'PRACTICAL',
            'lecturer_id' => $lecturer1->id,
        ]);

        Lecture::create([
            'name' => 'Database Systems',
            'code' => 'CS201',
            'type' => 'THEORY',
            'lecturer_id' => $lecturer2->id,
        ]);
    }
}
