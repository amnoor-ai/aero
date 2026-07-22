<?php

use App\Models\Department;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Test Workspace',
        'slug' => 'test-workspace',
        'owner_id' => $this->user->id,
    ]);
});

test('authenticated user can view departments index', function () {
    $response = $this->actingAs($this->user)->get(route('departments.index'));
    $response->assertStatus(200);
});

test('authenticated user can create department with mandate file', function () {
    Storage::fake('local');

    $file = UploadedFile::fake()->create('engineering_mandate.pdf', 100, 'application/pdf');

    $response = $this->actingAs($this->user)->post(route('departments.store'), [
        'name' => 'Engineering',
        'code' => 'ENG',
        'description' => 'Core technology department',
        'location' => 'HQ - 3rd Floor',
        'status' => 'active',
        'director_id' => $this->user->id,
        'mandate_file' => $file,
    ]);

    $department = Department::where('code', 'ENG')->first();
    expect($department)->not->toBeNull();
    expect($department->name)->toBe('Engineering');
    expect($department->mandate_file_name)->toBe('engineering_mandate.pdf');

    $response->assertRedirect(route('departments.show', $department->id));
});

test('authenticated user can download department mandate file', function () {
    Storage::fake('local');

    $file = UploadedFile::fake()->create('mandate.pdf', 100, 'application/pdf');
    $path = $file->store('mandates');

    $department = Department::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Design & UX',
        'code' => 'PDX',
        'slug' => 'design-ux',
        'mandate_file_path' => $path,
        'mandate_file_name' => 'mandate.pdf',
        'status' => 'active',
    ]);

    $response = $this->actingAs($this->user)->get(route('departments.mandate', $department->id));
    $response->assertStatus(200);
});
