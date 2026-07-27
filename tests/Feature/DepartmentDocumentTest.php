<?php

use App\Models\Department;
use App\Models\DepartmentDocument;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake();
    $this->user = User::factory()->create();
    $this->workspace = Workspace::firstOrCreate(
        ['id' => 1],
        ['name' => 'Test Workspace', 'slug' => 'test-workspace', 'owner_id' => $this->user->id]
    );
    $this->department = Department::create([
        'workspace_id' => $this->workspace->id,
        'name' => 'Engineering',
        'code' => 'ENG',
        'slug' => 'engineering',
        'status' => 'active',
    ]);
});

test('can upload a document to a department', function () {
    $file = UploadedFile::fake()->create('contract.pdf', 100, 'application/pdf');

    $response = $this->actingAs($this->user)
        ->post(route('departments.documents.store', $this->department), [
            'name' => 'Department Contract',
            'file' => $file,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('department_documents', [
        'department_id' => $this->department->id,
        'name' => 'Department Contract',
        'file_type' => 'pdf',
    ]);

    $doc = DepartmentDocument::first();
    Storage::assertExists($doc->file_path);
});

test('can view a department document', function () {
    $file = UploadedFile::fake()->create('image.png', 50, 'image/png');
    $path = $file->store('department-documents');

    $doc = DepartmentDocument::create([
        'department_id' => $this->department->id,
        'name' => 'Test Image',
        'file_path' => $path,
        'file_type' => 'png',
        'file_size' => 50,
        'uploaded_by_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('departments.documents.view', $doc));

    $response->assertOk();
});

test('can download a department document', function () {
    $file = UploadedFile::fake()->create('report.pdf', 120, 'application/pdf');
    $path = $file->store('department-documents');

    $doc = DepartmentDocument::create([
        'department_id' => $this->department->id,
        'name' => 'Report File',
        'file_path' => $path,
        'file_type' => 'pdf',
        'file_size' => 120,
        'uploaded_by_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('departments.documents.download', $doc));

    $response->assertDownload('Report File');
});

test('can rename a department document', function () {
    $doc = DepartmentDocument::create([
        'department_id' => $this->department->id,
        'name' => 'Old Title',
        'file_path' => 'department-documents/sample.pdf',
        'file_type' => 'pdf',
        'file_size' => 100,
        'uploaded_by_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)
        ->patch(route('departments.documents.update', $doc), [
            'name' => 'New Updated Title',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('department_documents', [
        'id' => $doc->id,
        'name' => 'New Updated Title',
    ]);
});

test('can delete a department document', function () {
    $file = UploadedFile::fake()->create('doc_to_delete.txt', 10);
    $path = $file->store('department-documents');

    $doc = DepartmentDocument::create([
        'department_id' => $this->department->id,
        'name' => 'Delete Me',
        'file_path' => $path,
        'file_type' => 'txt',
        'file_size' => 10,
        'uploaded_by_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)
        ->delete(route('departments.documents.destroy', $doc));

    $response->assertRedirect();
    $this->assertDatabaseMissing('department_documents', [
        'id' => $doc->id,
    ]);
    Storage::assertMissing($path);
});

test('can render global documents directory', function () {
    $response = $this->actingAs($this->user)
        ->get(route('departments.documents.index'));

    $response->assertOk();
});
