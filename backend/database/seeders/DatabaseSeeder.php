<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            YearSeeder::class,
            ActivitySeeder::class,
            DocumentSeeder::class,
            EquipmentSeeder::class,
            EventSeeder::class,
            SubscriptionSeeder::class,
            PaymentSeeder::class,
            AttendanceSeeder::class,
        ]);
    }
}
