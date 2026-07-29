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
        Schema::table('milestones', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->change();
            $table->foreignId('work_plan_id')->nullable()->after('project_id')->constrained('work_plans')->nullOnDelete();
            $table->date('start_date')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('milestones', function (Blueprint $table) {
            $table->dropForeign(['work_plan_id']);
            $table->dropColumn(['work_plan_id', 'start_date']);
        });
    }
};
