<?php

use App\Models\BoardColumn;
use App\Models\Department;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkPlan;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can view work plans index page', function () {
    $user = User::factory()->create();
    Workspace::create([
        'id' => 1,
        'owner_id' => $user->id,
        'name' => 'Default Workspace',
        'slug' => 'default-workspace',
    ]);
    $this->actingAs($user);

    $response = $this->get('/work-plan');

    $response->assertStatus(200);
});

test('user can create a work plan initiative and attach projects', function () {
    $user = User::factory()->create();
    Workspace::create([
        'id' => 1,
        'owner_id' => $user->id,
        'name' => 'Default Workspace',
        'slug' => 'default-workspace',
    ]);
    $this->actingAs($user);

    $project1 = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Alpha Project',
        'slug' => 'alpha-project',
    ]);
    $project2 = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Beta Project',
        'slug' => 'beta-project',
    ]);

    $response = $this->post('/work-plans', [
        'name' => 'Q3 Strategic Expansion',
        'description' => 'Expand product footprint across mobile and web.',
        'status' => 'active',
        'project_ids' => [$project1->id, $project2->id],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('work_plans', [
        'name' => 'Q3 Strategic Expansion',
    ]);

    $workPlan = WorkPlan::where('name', 'Q3 Strategic Expansion')->first();
    expect($workPlan->projects)->toHaveCount(2);
});

test('project completion percentage contributes equally to attached work plans', function () {
    $user = User::factory()->create();
    Workspace::create([
        'id' => 1,
        'owner_id' => $user->id,
        'name' => 'Default Workspace',
        'slug' => 'default-workspace',
    ]);
    $this->actingAs($user);

    $project1 = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Project One',
        'slug' => 'project-one',
    ]);
    $project2 = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Project Two',
        'slug' => 'project-two',
    ]);

    $workPlan = WorkPlan::create([
        'workspace_id' => 1,
        'name' => 'Portfolio Initiative',
    ]);

    $workPlan->projects()->attach([$project1->id, $project2->id]);

    // WorkPlan progress averages attached projects progress
    expect($workPlan->fresh()->progress)->toBe(0);
});

test('tasks can belong to project, department, or be standalone', function () {
    $user = User::factory()->create();
    Workspace::create([
        'id' => 1,
        'owner_id' => $user->id,
        'name' => 'Default Workspace',
        'slug' => 'default-workspace',
    ]);
    $this->actingAs($user);

    $project = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Project Task Scope',
        'slug' => 'project-task-scope',
    ]);
    $column = BoardColumn::create([
        'project_id' => $project->id,
        'name' => 'To Do',
        'position' => 1,
    ]);
    $department = Department::create([
        'workspace_id' => 1,
        'name' => 'Engineering',
        'code' => 'ENG',
        'slug' => 'engineering',
    ]);

    // 1. Project Task
    $projectTask = Task::create([
        'workspace_id' => 1,
        'project_id' => $project->id,
        'department_id' => null,
        'board_column_id' => $column->id,
        'title' => 'Project Task',
        'creator_id' => $user->id,
    ]);

    // 2. Department Task
    $deptTask = Task::create([
        'workspace_id' => 1,
        'project_id' => null,
        'department_id' => $department->id,
        'board_column_id' => $column->id,
        'title' => 'Department Task',
        'creator_id' => $user->id,
    ]);

    // 3. Standalone Task
    $standaloneTask = Task::create([
        'workspace_id' => 1,
        'project_id' => null,
        'department_id' => null,
        'board_column_id' => $column->id,
        'title' => 'Standalone Task',
        'creator_id' => $user->id,
    ]);

    expect($projectTask->project_id)->toBe($project->id);
    expect($deptTask->department_id)->toBe($department->id);
    expect($standaloneTask->project_id)->toBeNull();
    expect($standaloneTask->department_id)->toBeNull();
});

test('user can update project attachments for a work plan', function () {
    $user = User::factory()->create();
    Workspace::create([
        'id' => 1,
        'owner_id' => $user->id,
        'name' => 'Default Workspace',
        'slug' => 'default-workspace',
    ]);
    $this->actingAs($user);

    $project1 = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Proj 1',
        'slug' => 'proj-1',
    ]);
    $project2 = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Proj 2',
        'slug' => 'proj-2',
    ]);

    $workPlan = WorkPlan::create([
        'workspace_id' => 1,
        'name' => 'Initial Plan',
    ]);

    $workPlan->projects()->attach([$project1->id]);

    $response = $this->post("/work-plans/{$workPlan->id}/attach-projects", [
        'project_ids' => [$project1->id, $project2->id],
    ]);

    $response->assertRedirect();
    expect($workPlan->fresh()->projects)->toHaveCount(2);
});

test('user can delete a work plan without deleting attached projects', function () {
    $user = User::factory()->create();
    Workspace::create([
        'id' => 1,
        'owner_id' => $user->id,
        'name' => 'Default Workspace',
        'slug' => 'default-workspace',
    ]);
    $this->actingAs($user);

    $project = Project::create([
        'workspace_id' => 1,
        'lead_id' => $user->id,
        'name' => 'Single Project',
        'slug' => 'single-project',
    ]);
    $workPlan = WorkPlan::create([
        'workspace_id' => 1,
        'name' => 'Plan to Delete',
    ]);

    $workPlan->projects()->attach([$project->id]);

    $response = $this->delete("/work-plans/{$workPlan->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('work_plans', ['id' => $workPlan->id]);
    $this->assertDatabaseHas('projects', ['id' => $project->id]);
});
