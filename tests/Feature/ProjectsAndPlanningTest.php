<?php

use App\Models\Project;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Planning Test Workspace',
        'slug' => 'planning-test-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->project = Project::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Planning Test Project',
        'slug' => 'planning-test-project',
        'status' => 'ongoing',
        'lead_id' => $this->user->id,
    ]);
});

test('authenticated user can view activities feed', function () {
    $response = $this->actingAs($this->user)->get(route('activities.index'));
    $response->assertStatus(200);
});

test('authenticated user can view global milestones dashboard', function () {
    $response = $this->actingAs($this->user)->get(route('milestones.global'));
    $response->assertStatus(200);
});

test('authenticated user can create a project milestone', function () {
    $response = $this->actingAs($this->user)->post(route('projects.milestones.store', $this->project->id), [
        'name' => 'Beta 1.0 Milestone',
        'description' => 'Release target for core MVP',
        'due_date' => now()->addDays(15)->toDateString(),
        'status' => 'active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('milestones', [
        'project_id' => $this->project->id,
        'name' => 'Beta 1.0 Milestone',
    ]);
});

test('authenticated user can view work plan gantt roadmap', function () {
    $response = $this->actingAs($this->user)->get(route('work-plan.index'));
    $response->assertStatus(200);
});
