<?php

use App\Models\Milestone;
use App\Models\Project;
use App\Models\User;
use App\Models\WorkPlan;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'Milestone Test Workspace',
        'slug' => 'milestone-test-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->project = Project::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Milestone Test Project',
        'slug' => 'milestone-test-project',
        'status' => 'ongoing',
        'lead_id' => $this->user->id,
    ]);

    $this->workPlan = WorkPlan::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Q3 Strategic Work Plan',
        'status' => 'active',
    ]);
});

test('authenticated user can view milestones directory with projects and work plans', function () {
    $response = $this->actingAs($this->user)->get(route('milestones.global'));
    $response->assertStatus(200);
});

test('authenticated user can create a milestone assigned to a project', function () {
    $response = $this->actingAs($this->user)->post(route('milestones.store'), [
        'name' => 'Project Alpha Launch',
        'description' => 'Target release date for Alpha',
        'owner_type' => 'project',
        'project_id' => $this->project->id,
        'start_date' => '2026-08-01',
        'due_date' => '2026-08-15',
        'status' => 'active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('milestones', [
        'name' => 'Project Alpha Launch',
        'project_id' => $this->project->id,
        'work_plan_id' => null,
        'status' => 'active',
    ]);
});

test('authenticated user can create a milestone assigned to a work plan', function () {
    $response = $this->actingAs($this->user)->post(route('milestones.store'), [
        'name' => 'Portfolio Initiative M1',
        'description' => 'Cross-project alignment checkpoint',
        'owner_type' => 'work_plan',
        'work_plan_id' => $this->workPlan->id,
        'start_date' => '2026-09-01',
        'due_date' => '2026-09-30',
        'status' => 'upcoming',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('milestones', [
        'name' => 'Portfolio Initiative M1',
        'project_id' => null,
        'work_plan_id' => $this->workPlan->id,
        'status' => 'upcoming',
    ]);
});

test('authenticated user can update a milestone status and date range', function () {
    $milestone = Milestone::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'name' => 'Initial Milestone',
        'status' => 'active',
    ]);

    $response = $this->actingAs($this->user)->put(route('milestones.update', $milestone->id), [
        'name' => 'Updated Milestone Title',
        'owner_type' => 'work_plan',
        'work_plan_id' => $this->workPlan->id,
        'start_date' => '2026-10-01',
        'due_date' => '2026-10-31',
        'status' => 'completed',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('milestones', [
        'id' => $milestone->id,
        'name' => 'Updated Milestone Title',
        'project_id' => null,
        'work_plan_id' => $this->workPlan->id,
        'status' => 'completed',
    ]);
});

test('authenticated user can delete a milestone', function () {
    $milestone = Milestone::create([
        'workspace_id' => $this->workspace->id,
        'project_id' => $this->project->id,
        'name' => 'Temporary Milestone',
        'status' => 'active',
    ]);

    $response = $this->actingAs($this->user)->delete(route('milestones.destroy', $milestone->id));
    $response->assertRedirect();

    $this->assertDatabaseMissing('milestones', [
        'id' => $milestone->id,
    ]);
});
