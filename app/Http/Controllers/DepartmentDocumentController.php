<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\DepartmentDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DepartmentDocumentController extends Controller
{
    /**
     * Display global documents directory across all departments.
     */
    public function index(Request $request): Response
    {
        $workspaceId = 1;
        $departments = Department::where('workspace_id', $workspaceId)->select('id', 'name', 'code')->get();

        $query = DepartmentDocument::with(['department', 'uploadedBy'])
            ->whereHas('department', function ($q) use ($workspaceId) {
                $q->where('workspace_id', $workspaceId);
            });

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('file_type', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->input('department_id'));
        }

        $documents = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Departments/DocumentsIndex', [
            'documents' => $documents,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department_id']),
        ]);
    }

    /**
     * Store a newly uploaded document for a department.
     */
    public function store(Request $request, Department $department): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'file' => 'required|file|max:51200', // 50MB max
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $displayName = ! empty($validated['name']) ? $validated['name'] : $originalName;
        $path = $file->store('department-documents');
        $extension = strtolower($file->getClientOriginalExtension());

        DepartmentDocument::create([
            'department_id' => $department->id,
            'name' => $displayName,
            'file_path' => $path,
            'file_type' => $extension,
            'file_size' => $file->getSize(),
            'uploaded_by_id' => Auth::id(),
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    /**
     * Stream document for inline viewing.
     */
    public function view(DepartmentDocument $document): SymfonyResponse
    {
        if (! Storage::exists($document->file_path)) {
            abort(404, 'Document file not found.');
        }

        $type = strtolower($document->file_type ?? '');
        $inlineable = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'mp4', 'webm', 'ogg', 'mov', 'txt', 'html'];

        if (! in_array($type, $inlineable)) {
            return Storage::download($document->file_path, $document->name);
        }

        return Storage::response($document->file_path);
    }

    /**
     * Download document file.
     */
    public function download(DepartmentDocument $document): StreamedResponse|RedirectResponse
    {
        if (! Storage::exists($document->file_path)) {
            return back()->with('error', 'Document file not found.');
        }

        return Storage::download($document->file_path, $document->name);
    }

    /**
     * Rename document.
     */
    public function update(Request $request, DepartmentDocument $document): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $document->update([
            'name' => $validated['name'],
        ]);

        return back()->with('success', 'Document updated successfully.');
    }

    /**
     * Delete document.
     */
    public function destroy(DepartmentDocument $document): RedirectResponse
    {
        if (Storage::exists($document->file_path)) {
            Storage::delete($document->file_path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }
}
