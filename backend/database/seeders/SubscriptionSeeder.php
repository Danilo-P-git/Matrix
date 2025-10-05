<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Activity;
use Carbon\Carbon;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get user and activities
        $user = User::first();
        $tennisActivity = Activity::where('name', 'Corso di Tennis')->first();
        $volleyActivity = Activity::where('name', 'Pallavolo Giovanile')->first();
        $swimmingActivity = Activity::where('name', 'Nuoto Libero')->first();

        if (!$user || !$tennisActivity) {
            return; // Skip if no user or activities found
        }

        $subscriptions = [
            [
                'user_id' => $user->id,
                'activity_id' => $tennisActivity->id,
                'created_at' => Carbon::create(2024, 9, 15),
                'updated_at' => now(),
            ],
        ];

        // Add volleyball subscription if exists
        if ($volleyActivity) {
            $subscriptions[] = [
                'user_id' => $user->id,
                'activity_id' => $volleyActivity->id,
                'created_at' => Carbon::create(2024, 9, 10),
                'updated_at' => now(),
            ];
        }

        // Add swimming subscription if exists (with exit date)
        if ($swimmingActivity) {
            $subscriptions[] = [
                'user_id' => $user->id,
                'activity_id' => $swimmingActivity->id,
                'exit_date' => Carbon::create(2024, 10, 1),
                'created_at' => Carbon::create(2024, 9, 1),
                'updated_at' => now(),
            ];
        }

        foreach ($subscriptions as $subscription) {
            Subscription::create($subscription);
        }
    }
}