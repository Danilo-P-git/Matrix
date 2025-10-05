<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained();
            $table->foreignId('activity_id')->constrained();
            $table->foreignId('user_id')->constrained();
            // eventi da aggiungere in migrazione successiva
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_activities');
    }
};
