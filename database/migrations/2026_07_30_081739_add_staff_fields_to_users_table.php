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
        Schema::table('users', function (Blueprint $table) {
            $table->string('emp_id')->nullable()->unique()->after('id');
            $table->string('phone')->nullable()->after('email');
            $table->string('job_title')->nullable()->default('Developer')->after('phone');
            $table->string('status')->default('active')->after('department_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['emp_id', 'phone', 'job_title', 'status']);
        });
    }
};
