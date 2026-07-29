<?php

use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->user = User::factory()->create();
    $this->workspace = Workspace::create([
        'name' => 'File Test Workspace',
        'slug' => 'file-test-workspace',
        'owner_id' => $this->user->id,
    ]);

    $this->project = Project::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'File Test Project',
        'slug' => 'file-test-project',
        'status' => 'ongoing',
        'lead_id' => $this->user->id,
    ]);
});

test('authenticated user can upload a file to project', function () {
    $file = UploadedFile::fake()->create('architecture_spec.pdf', 1024, 'application/pdf');

    $response = $this->actingAs($this->user)->post(route('projects.documents.store', $this->project->id), [
        'file' => $file,
        'folder_name' => 'API Specs',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('project_documents', [
        'project_id' => $this->project->id,
        'name' => 'architecture_spec.pdf',
        'folder_name' => 'API Specs',
    ]);
});

test('authenticated user can view and download project document', function () {
    $file = UploadedFile::fake()->create('mockup.png', 500, 'image/png');
    $path = $file->store('project_documents', 'public');

    $doc = ProjectDocument::create([
        'project_id' => $this->project->id,
        'name' => 'mockup.png',
        'file_path' => $path,
        'file_size' => 500,
        'file_type' => 'image/png',
        'uploaded_by' => $this->user->id,
    ]);

    $viewResponse = $this->actingAs($this->user)->get(route('projects.documents.view', $doc->id));
    $viewResponse->assertStatus(200);

    $downloadResponse = $this->actingAs($this->user)->get(route('projects.documents.download', $doc->id));
    $downloadResponse->assertStatus(200);
});

test('authenticated user can delete project document', function () {
    $file = UploadedFile::fake()->create('temp.txt', 10, 'text/plain');
    $path = $file->store('project_documents', 'public');

    $doc = ProjectDocument::create([
        'project_id' => $this->project->id,
        'name' => 'temp.txt',
        'file_path' => $path,
        'file_size' => 10,
        'file_type' => 'text/plain',
        'uploaded_by' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->delete(route('projects.documents.destroy', $doc->id));
    $response->assertRedirect();

    $this->assertDatabaseMissing('project_documents', [
        'id' => $doc->id,
    ]);
});
