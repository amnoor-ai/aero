<?php

use App\Models\BoardColumn;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Test Workspace',
        'slug' => 'test-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->project = Project::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Test Project',
        'slug' => 'test-project',
        'status' => 'ongoing',
        'lead_id' => $this->user->id,
    ]);

    $this->column = BoardColumn::create([
        'project_id' => $this->project->id,
        'name' => 'To Do',
        'position' => 1,
    ]);
});

test('authenticated user can view dashboard', function () {
    $response = $this->actingAs($this->user)->get(route('dashboard'));
    $response->assertStatus(200);
});

test('authenticated user can view my desk', function () {
    $response = $this->actingAs($this->user)->get(route('my-desk'));
    $response->assertStatus(200);
});

test('authenticated user can view projects hub', function () {
    $response = $this->actingAs($this->user)->get(route('projects.index'));
    $response->assertStatus(200);
});

test('authenticated user can create a new project', function () {
    $response = $this->actingAs($this->user)->post(route('projects.store'), [
        'name' => 'New Awesome Project',
        'description' => 'Test description',
        'status' => 'planned',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('projects', ['name' => 'New Awesome Project']);
});

test('authenticated user can create and update a task', function () {
    $task = Task::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'board_column_id' => $this->column->id,
        'title' => 'Initial Task',
        'type' => 'feature',
        'priority' => 'high',
        'creator_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->patch(route('tasks.update', $task->id), [
        'title' => 'Updated Task Title',
        'priority' => 'urgent',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated Task Title',
        'priority' => 'urgent',
    ]);
});
