<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Event;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $users = User::all();
        $events = Event::all();

        if ($users->isEmpty() || $events->isEmpty()) {
            $this->command->info('Skipping AttendanceSeeder: No users or events found');
            return;
        }

        $attendances = [
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Partecipazione regolare all\'evento',
                'status' => 'presente',
                'exit_date' => Carbon::now()->subHours(2),
                'is_outsider' => false,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Assenza giustificata per motivi personali',
                'status' => 'assente',
                'is_outsider' => false,
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Partecipazione di un ospite esterno',
                'status' => 'presente',
                'exit_date' => Carbon::now()->subHours(1),
                'is_outsider' => true,
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Presente ma uscito prima della fine',
                'status' => 'presente',
                'exit_date' => Carbon::now()->subHours(3),
                'is_outsider' => false,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'status' => 'presente',
                'is_outsider' => false,
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Assenza non giustificata',
                'status' => 'assente',
                'is_outsider' => false,
                'created_at' => Carbon::now()->subDay(),
                'updated_at' => Carbon::now()->subDay(),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Ospite esterno che non si è presentato',
                'status' => 'assente',
                'is_outsider' => true,
                'created_at' => Carbon::now()->subDay(),
                'updated_at' => Carbon::now()->subDay(),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Partecipazione completa all\'evento sportivo',
                'status' => 'presente',
                'exit_date' => Carbon::now()->subMinutes(30),
                'is_outsider' => false,
                'created_at' => Carbon::now()->subHours(6),
                'updated_at' => Carbon::now()->subHours(6),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Presente per metà evento',
                'status' => 'presente',
                'exit_date' => Carbon::now()->subHours(4),
                'is_outsider' => false,
                'created_at' => Carbon::now()->subHours(8),
                'updated_at' => Carbon::now()->subHours(8),
            ],
            [
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'note' => 'Partecipazione come istruttore',
                'status' => 'presente',
                'is_outsider' => false,
                'created_at' => Carbon::now()->subHours(12),
                'updated_at' => Carbon::now()->subHours(12),
            ],
        ];

        foreach ($attendances as $attendanceData) {
            Attendance::create($attendanceData);
        }

        $this->command->info('AttendanceSeeder completed successfully!');
    }
}