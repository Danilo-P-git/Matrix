<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\User;
use App\Models\Activity;
use App\Models\Event;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get user, activities, and events
        $user = User::first();
        $tennisActivity = Activity::where('name', 'Corso di Tennis')->first();
        $volleyActivity = Activity::where('name', 'Pallavolo Giovanile')->first();
        $tennisEvent = Event::where('name', 'Torneo Tennis Autunnale')->first();

        if (!$user) {
            return; // Skip if no user found
        }

        $payments = [];

        // Payment for tennis activity
        if ($tennisActivity) {
            $payments[] = [
                'user_id' => $user->id,
                'activity_id' => $tennisActivity->id,
                'amount' => 120.00,
                'description' => 'Pagamento corso di tennis',
                'type_of_payment' => 'carta',
                'status' => 'completato',
                'is_partial' => false,
                'created_at' => Carbon::create(2024, 9, 15),
                'updated_at' => now(),
            ];
        }

        // Payment for volleyball activity
        if ($volleyActivity) {
            $payments[] = [
                'user_id' => $user->id,
                'activity_id' => $volleyActivity->id,
                'amount' => 80.00,
                'description' => 'Pagamento pallavolo giovanile',
                'type_of_payment' => 'bonifico',
                'status' => 'completato',
                'is_partial' => false,
                'created_at' => Carbon::create(2024, 9, 10),
                'updated_at' => now(),
            ];
        }

        // Payment for tennis tournament event
        if ($tennisEvent) {
            $payments[] = [
                'user_id' => $user->id,
                'event_id' => $tennisEvent->id,
                'amount' => 25.00,
                'description' => 'Iscrizione torneo tennis autunnale',
                'type_of_payment' => 'contanti',
                'status' => 'da pagare',
                'is_partial' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach ($payments as $payment) {
            Payment::create($payment);
        }
    }
}