<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProjectDocumentController extends Controller
{
    /**
     * Store a newly uploaded file for a project.
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'file' => 'required|file|max:51200', // 50MB max
            'folder_name' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $documentName = ! empty($validated['name']) ? $validated['name'] : $originalName;

        $path = $file->store('project_documents', 'public');

        ProjectDocument::create([
            'project_id' => $project->id,
            'name' => $documentName,
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientMimeType() ?: $file->getClientOriginalExtension(),
            'folder_name' => $validated['folder_name'] ?? null,
            'uploaded_by' => Auth::id(),
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    /**
     * View/Stream the document directly.
     */
    public function view(ProjectDocument $document): SymfonyResponse
    {
        if (! Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'File not found on storage.');
        }

        $filePath = Storage::disk('public')->path($document->file_path);
        $mimeType = Storage::disk('public')->mimeType($document->file_path) ?: 'application/octet-stream';

        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="'.addslashes($document->name).'"',
        ]);
    }

    /**
     * Download the document.
     */
    public function download(ProjectDocument $document): StreamedResponse
    {
        if (! Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'File not found on storage.');
        }

        return Storage::disk('public')->download($document->file_path, $document->name);
    }

    /**
     * Delete the document.
     */
    public function destroy(ProjectDocument $document): RedirectResponse
    {
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }
}
