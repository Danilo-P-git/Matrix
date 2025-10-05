<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\User;
use Carbon\Carbon;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'Mario Rossi',
                'email' => 'mario.rossi@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        $documents = [
            [
                'name' => 'Certificato Medico',
                'description' => 'Certificato medico per attività sportiva',
                'note' => 'Valido fino a giugno 2025',
                'path' => '/documents/certificato_medico_2024.pdf',
                'type' => 'certificato',
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Modulo Iscrizione',
                'description' => 'Modulo di iscrizione firmato per corso tennis',
                'note' => 'Compilato e firmato dai genitori',
                'path' => '/documents/modulo_iscrizione_tennis.pdf',
                'type' => 'modulo',
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Liberatoria',
                'description' => 'Liberatoria per partecipazione eventi',
                'note' => 'Firmata dal genitore tutore',
                'path' => '/documents/liberatoria_eventi.pdf',
                'type' => 'liberatoria',
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($documents as $document) {
            Document::create($document);
        }
    }
}