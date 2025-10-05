<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;
use App\Models\Year;
use Carbon\Carbon;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first year to associate activities with
        $currentYear = Year::where('name', '2024-2025')->first();
        
        if (!$currentYear) {
            // If no year exists, create one
            $currentYear = Year::create([
                'name' => '2024-2025',
                'start_date' => Carbon::create(2024, 9, 1),
                'end_date' => Carbon::create(2025, 6, 30),
                'description' => 'Anno accademico 2024-2025',
                'note' => 'Anno corrente',
            ]);
        }

        $activities = [
            [
                'name' => 'Corso di Tennis',
                'description' => 'Corso base di tennis per principianti e intermedi',
                'start_date' => Carbon::create(2024, 10, 1, 9, 0),
                'end_date' => Carbon::create(2024, 12, 20, 18, 0),
                'note' => 'Portare racchetta e abbigliamento sportivo',
                'year_id' => $currentYear->id,
                'cost' => 120.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pallavolo Giovanile',
                'description' => 'Attività di pallavolo per ragazzi dai 12 ai 18 anni',
                'start_date' => Carbon::create(2024, 9, 15, 16, 0),
                'end_date' => Carbon::create(2025, 5, 30, 19, 0),
                'note' => 'Allenamenti martedì e giovedì',
                'year_id' => $currentYear->id,
                'cost' => 80.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nuoto Libero',
                'description' => 'Accesso libero alla piscina per nuoto ricreativo',
                'start_date' => Carbon::create(2024, 9, 1, 7, 0),
                'end_date' => Carbon::create(2025, 6, 30, 22, 0),
                'note' => 'Aperto tutti i giorni, cuffia obbligatoria',
                'year_id' => $currentYear->id,
                'cost' => 50.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}