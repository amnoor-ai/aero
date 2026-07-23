<?php

use App\Models\BoardColumn;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Directory Test Workspace',
        'slug' => 'directory-test-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->project = Project::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Directory Test Project',
        'slug' => 'directory-test-project',
        'status' => 'ongoing',
        'lead_id' => $this->user->id,
    ]);

    $this->column = BoardColumn::create([
        'project_id' => $this->project->id,
        'name' => 'To Do',
        'position' => 1,
    ]);
});

test('authenticated user can view global tasks directory with pagination', function () {
    Task::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'board_column_id' => $this->column->id,
        'title' => 'Sample Directory Task',
        'type' => 'feature',
        'priority' => 'high',
        'creator_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->get(route('tasks.index'));
    $response->assertStatus(200);
});

test('authenticated user can filter tasks directory by priority and search', function () {
    Task::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'board_column_id' => $this->column->id,
        'title' => 'Unique Feature Task',
        'type' => 'feature',
        'priority' => 'urgent',
        'creator_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->get(route('tasks.index', [
        'search' => 'Unique',
        'priority' => 'urgent',
    ]));

    $response->assertStatus(200);
});

test('authenticated user can stream export tasks csv file', function () {
    Task::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'board_column_id' => $this->column->id,
        'title' => 'Exportable CSV Task',
        'type' => 'feature',
        'priority' => 'high',
        'creator_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->get(route('tasks.export-csv'));
    $response->assertStatus(200);
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
});
