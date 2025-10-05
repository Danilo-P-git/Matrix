<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Equipment;
use App\Models\Year;
use Carbon\Carbon;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the current year
        $currentYear = Year::where('name', '2024-2025')->first();
        
        if (!$currentYear) {
            $currentYear = Year::first();
        }

        $equipment = [
            [
                'name' => 'Racchetta Tennis',
                'description' => 'Racchetta tennis professionale per principianti',
                'quantity' => 1,
                'code' => 'RTN001',
                'type' => 'attrezzo_sportivo',
                'year_id' => $currentYear->id,
                'status' => 'available',
                'is_available_for_sale' => false,
                'condition' => 'nuova',
                'size' => 'M',
                'note' => 'Racchetta in ottime condizioni',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pallone Pallavolo',
                'description' => 'Pallone ufficiale per allenamenti pallavolo',
                'quantity' => 3,
                'code' => 'PVL002',
                'type' => 'attrezzo_sportivo',
                'year_id' => $currentYear->id,
                'status' => 'available',
                'condition' => 'nuova',
                'size' => 'standard',
                'note' => 'Set di 3 palloni per allenamento',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Costume Piscina',
                'description' => 'Costume da bagno per corso nuoto',
                'quantity' => 1,
                'code' => 'CST003',
                'type' => 'abbigliamento',
                'year_id' => $currentYear->id,
                'status' => 'available',
                'is_available_for_sale' => true,
                'condition' => 'nuova',
                'size' => 'L',
                'note' => 'Disponibile per vendita',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }
    }
}