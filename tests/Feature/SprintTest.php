<?php

use App\Models\BoardColumn;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Sprint Test Workspace',
        'slug' => 'sprint-test-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->project = Project::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Sprint Test Project',
        'slug' => 'sprint-test-project',
        'status' => 'ongoing',
        'lead_id' => $this->user->id,
    ]);

    $this->columnTodo = BoardColumn::create([
        'project_id' => $this->project->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    $this->columnDone = BoardColumn::create([
        'project_id' => $this->project->id,
        'name' => 'Done',
        'position' => 2,
    ]);
});

test('authenticated user can create a future sprint', function () {
    $response = $this->actingAs($this->user)->post(route('sprints.store'), [
        'project_id' => $this->project->id,
        'name' => 'Sprint 1 - Foundations',
        'goal' => 'Build core architecture',
        'status' => 'future',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDays(14)->toDateString(),
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sprints', [
        'project_id' => $this->project->id,
        'name' => 'Sprint 1 - Foundations',
        'status' => 'future',
    ]);
});

test('authenticated user can start a sprint and activate it', function () {
    $sprint = Sprint::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'name' => 'Sprint 2 - Navigation',
        'status' => 'future',
    ]);

    $response = $this->actingAs($this->user)->post(route('sprints.start', $sprint->id));

    $response->assertRedirect();
    $this->assertDatabaseHas('sprints', [
        'id' => $sprint->id,
        'status' => 'active',
    ]);
});

test('authenticated user can assign tasks to a sprint', function () {
    $sprint = Sprint::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'name' => 'Sprint 3 - Features',
        'status' => 'active',
    ]);

    $task = Task::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'board_column_id' => $this->columnTodo->id,
        'title' => 'Unassigned Backlog Task',
        'type' => 'feature',
        'priority' => 'high',
        'creator_id' => $this->user->id,
        'sprint_id' => null,
    ]);

    $response = $this->actingAs($this->user)->post(route('sprints.assign-tasks'), [
        'task_ids' => [$task->id],
        'sprint_id' => $sprint->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'sprint_id' => $sprint->id,
    ]);
});

test('authenticated user can complete sprint and rollover incomplete tasks', function () {
    $sprint = Sprint::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'name' => 'Sprint 4 - Release',
        'status' => 'active',
    ]);

    $incompleteTask = Task::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'board_column_id' => $this->columnTodo->id,
        'title' => 'Incomplete Feature',
        'type' => 'feature',
        'priority' => 'high',
        'creator_id' => $this->user->id,
        'sprint_id' => $sprint->id,
    ]);

    $response = $this->actingAs($this->user)->post(route('sprints.complete', $sprint->id), [
        'rollover_action' => 'backlog',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sprints', [
        'id' => $sprint->id,
        'status' => 'completed',
    ]);
    $this->assertDatabaseHas('tasks', [
        'id' => $incompleteTask->id,
        'sprint_id' => null,
    ]);
});
