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
        Schema::create('base_forms', function (Blueprint $table) {
            $table->id()->primary()->comment('ID');
            $table->string('input_field')->nullable();
            $table->integer('number_field')->nullable();
            $table->string('select_single_field')->nullable();
            $table->json('select_multiple_field')->nullable();
            $table->json('cascading_field')->nullable();
            $table->json('tree_field')->nullable();
            $table->date('date_field')->nullable();
            $table->text('rich_text_field')->nullable();
            $table->string('image_field')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('base_forms');
    }
};
