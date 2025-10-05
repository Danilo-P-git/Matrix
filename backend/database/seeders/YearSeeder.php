<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Year;
use Carbon\Carbon;

class YearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $years = [
            [
                'name' => '2023-2024',
                'start_date' => Carbon::create(2023, 9, 1),
                'end_date' => Carbon::create(2024, 6, 30),
                'description' => 'Anno accademico 2023-2024',
                'note' => 'Anno con focus su attività sportive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2024-2025',
                'start_date' => Carbon::create(2024, 9, 1),
                'end_date' => Carbon::create(2025, 6, 30),
                'description' => 'Anno accademico 2024-2025',
                'note' => 'Anno corrente con nuove attività',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2025-2026',
                'start_date' => Carbon::create(2025, 9, 1),
                'end_date' => Carbon::create(2026, 6, 30),
                'description' => 'Anno accademico 2025-2026',
                'note' => 'Anno futuro in pianificazione',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($years as $year) {
            Year::create($year);
        }
    }
}