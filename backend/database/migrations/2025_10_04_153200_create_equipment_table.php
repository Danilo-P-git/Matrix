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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('quantity')->default(1);
            $table->string('code')->nullable();
            $table->string('type')->nullable();
            $table->foreignId('year_id')->constrained();
            $table->foreignId('subscription_id')->nullable()->constrained();
            $table->dateTime('assign_date')->nullable();
            $table->dateTime('return_date')->nullable();
            $table->enum('status', ['available', 'assigned', 'under_maintenance'])->default('available');
            $table->boolean('is_available_for_sale')->nullable()->default(null);
            $table->enum('condition', ['nuova', 'usata', 'danneggiata', 'rotta'])->default('nuova');
            $table->string('size')->nullable();
            $table->text('note')->nullable();
            $table->foreignId('event_id')->nullable()->constrained();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
