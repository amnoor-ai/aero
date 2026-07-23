<?php

use App\Models\Department;
use App\Models\Project;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->member = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Wizard Workspace',
        'slug' => 'wizard-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->department = Department::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Engineering Ops',
        'code' => 'ENG-OPS',
        'slug' => 'engineering-ops',
    ]);
});

test('authenticated user can store project via multi-step wizard with draft status, budget, tags, and department', function () {
    $response = $this->actingAs($this->user)->post(route('projects.store'), [
        'name' => 'AI Autonomous Bot',
        'department_id' => $this->department->id,
        'lead_id' => $this->user->id,
        'description' => 'Automated deployment and monitoring bot framework',
        'status' => 'draft',
        'start_date' => '2026-08-01',
        'due_date' => '2026-12-31',
        'budget' => 50000,
        'tags' => ['ai', 'automation', 'devops'],
        'members' => [
            ['user_id' => $this->member->id, 'role' => 'developer'],
        ],
    ]);

    $response->assertRedirect();

    $project = Project::where('name', 'AI Autonomous Bot')->first();
    expect($project)->not->toBeNull();
    expect($project->status)->toBe('draft');
    expect((float) $project->budget)->toBe(50000.0);
    expect($project->tags)->toBe(['ai', 'automation', 'devops']);
    expect($project->department_id)->toBe($this->department->id);
    expect($project->members->pluck('id')->toArray())->toContain($this->member->id);
    expect($project->boardColumns->count())->toBe(5);
});

test('project creation validation enforces required fields', function () {
    $response = $this->actingAs($this->user)->post(route('projects.store'), [
        'name' => '',
        'status' => 'invalid-status',
    ]);

    $response->assertSessionHasErrors(['name', 'status']);
});
