<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->foreignId('director_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('location')->nullable();
            $table->string('mandate_file_path')->nullable();
            $table->string('mandate_file_name')->nullable();
            $table->string('status')->default('active'); // active, archived
            $table->timestamps();

            $table->unique(['workspace_id', 'slug']);
            $table->unique(['workspace_id', 'code']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->after('email')->constrained('departments')->nullOnDelete();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->after('workspace_id')->constrained('departments')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
        });

        Schema::dropIfExists('departments');
    }
};
