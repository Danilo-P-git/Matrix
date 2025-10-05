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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('activity_id')->nullable()->constrained();
            $table->foreignId('event_id')->nullable()->constrained();
            $table->decimal('amount', 10, 2);
            $table->text('description')->nullable();
            $table->enum('type_of_payment', ['contanti', 'carta', 'bonifico', 'e-pay'])->default('contanti');
            $table->enum('status', ['da pagare', 'completato', 'annullato'])->default('Da pagare');
            $table->boolean('is_partial')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('events', function (Blueprint $table) {
            $table->decimal('cost', 10, 2)->after('is_full');

        });
        Schema::table('activities', function (Blueprint $table) {
            $table->decimal('cost', 10, 2)->after('note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
