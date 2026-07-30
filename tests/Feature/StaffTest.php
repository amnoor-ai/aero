<?php

use App\Models\Department;
use App\Models\Team;
use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->admin = User::factory()->create(['status' => 'active']);
    $this->workspace = Workspace::create([
        'name' => 'Staff Workspace',
        'slug' => 'staff-workspace',
        'owner_id' => $this->admin->id,
    ]);
    $this->department = Department::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Engineering Division',
        'code' => 'ENG',
        'slug' => 'engineering-division',
    ]);
    $this->team = Team::create([
        'name' => 'Development Squad',
        'slug' => 'development-squad',
    ]);
});

test('authenticated user can view staff directory', function () {
    $response = $this->actingAs($this->admin)->get(route('staff.index'));
    $response->assertStatus(200);
});

test('authenticated user can create a staff member', function () {
    $response = $this->actingAs($this->admin)->post(route('staff.store'), [
        'name' => 'Mohamednor Isak',
        'email' => 'mohamednor@thechain.so',
        'phone' => '+252 61 5500000',
        'emp_id' => 'TCHN1001',
        'job_title' => 'Senior Developer',
        'department_id' => $this->department->id,
        'team_ids' => [$this->team->id],
        'status' => 'active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'email' => 'mohamednor@thechain.so',
        'emp_id' => 'TCHN1001',
        'job_title' => 'Senior Developer',
        'department_id' => $this->department->id,
        'status' => 'active',
    ]);
});

test('authenticated user can update staff member details and teams', function () {
    $staff = User::factory()->create([
        'emp_id' => 'TCHN1002',
        'job_title' => 'Developer',
        'status' => 'active',
    ]);

    $response = $this->actingAs($this->admin)->put(route('staff.update', $staff->id), [
        'name' => 'Updated Staff Name',
        'email' => $staff->email,
        'phone' => '+252 61 5500001',
        'emp_id' => 'TCHN1002',
        'job_title' => 'Lead Engineer',
        'department_id' => $this->department->id,
        'team_ids' => [$this->team->id],
        'status' => 'active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'name' => 'Updated Staff Name',
        'job_title' => 'Lead Engineer',
        'department_id' => $this->department->id,
    ]);
});

test('authenticated user can suspend a staff member', function () {
    $staff = User::factory()->create([
        'status' => 'active',
    ]);

    $response = $this->actingAs($this->admin)->delete(route('staff.destroy', $staff->id));
    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'status' => 'suspended',
    ]);
});
