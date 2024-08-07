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
        Schema::create('admin_permissions', function (Blueprint $table) {
            $table->id()->comment('主键ID');
            $table->string('title')->comment('权限名称');
            $table->string('permission')->comment('权限标识');
            $table->unsignedInteger('sort')->default(0)->comment('排序')->nullable();
            $table->bigInteger('parentId')->default(0)->comment('父级ID')->nullable();
            $table->string('dbTable')->comment('关联表名')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_permissions');
    }
};
