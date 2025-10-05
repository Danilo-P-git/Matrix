<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'name' => 'Torneo Tennis Autunnale',
                'description' => 'Torneo di tennis per tutti i livelli',
                'location' => 'Campo Tennis Centro Sportivo',
                'start_time' => Carbon::create(2024, 11, 15, 9, 0),
                'end_time' => Carbon::create(2024, 11, 15, 18, 0),
                'status' => 'Programmato',
                'is_full' => false,
                'cost' => 25.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gara Nuoto Giovanile',
                'description' => 'Competizione di nuoto per under 18',
                'location' => 'Piscina Comunale',
                'start_time' => Carbon::create(2024, 12, 10, 10, 0),
                'end_time' => Carbon::create(2024, 12, 10, 16, 0),
                'status' => 'Programmato',
                'is_full' => false,
                'cost' => 15.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Memorial Pallavolo',
                'description' => 'Torneo memorial di pallavolo',
                'location' => 'Palestra Scuola Media',
                'start_time' => Carbon::create(2024, 10, 20, 14, 0),
                'end_time' => Carbon::create(2024, 10, 20, 19, 0),
                'status' => 'Completato',
                'is_full' => true,
                'cost' => 20.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}