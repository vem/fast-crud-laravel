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
        Schema::create('admin_roles', function (Blueprint $table) {
            $table->id()->comment('主键ID');
            $table->enum('active', ['yes', 'no'])->default('no')->comment('是否启用');
            $table->string('roleName')->comment('角色名称');
            $table->text('permissionIds')->nullable()->comment('权限ID集合');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_roles');
    }
};
