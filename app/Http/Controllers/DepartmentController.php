<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        $workspaceId = 1;
        $query = Department::where('workspace_id', $workspaceId)
            ->with(['director'])
            ->withCount(['members', 'projects']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $sortBy = $request->input('sort_by', 'updated_at');
        $order = strtolower($request->input('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (in_array($sortBy, ['name', 'code', 'location', 'created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $order);
        } else {
            $query->latest('updated_at');
        }

        $departments = $query->paginate(15)->withQueryString();
        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'workspaceUsers' => $users,
            'filters' => $request->only(['search', 'status', 'sort_by', 'order']),
        ]);
    }

    public function show(Department $department): Response
    {
        $department->load([
            'director',
            'members',
            'projects' => function ($q) {
                $q->with('lead')->withCount('tasks');
            },
        ])->loadCount(['members', 'projects']);

        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('Departments/Show', [
            'department' => $department,
            'workspaceUsers' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10',
            'description' => 'nullable|string',
            'director_id' => 'nullable|exists:users,id',
            'location' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,archived',
            'mandate_file' => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240',
        ]);

        $workspaceId = 1;
        $slug = Str::slug($validated['name']).'-'.Str::random(4);

        $mandatePath = null;
        $mandateName = null;

        if ($request->hasFile('mandate_file')) {
            $file = $request->file('mandate_file');
            $mandateName = $file->getClientOriginalName();
            $mandatePath = $file->store('mandates');
        }

        $department = Department::create([
            'workspace_id' => $workspaceId,
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'director_id' => $validated['director_id'] ?? null,
            'location' => $validated['location'] ?? null,
            'mandate_file_path' => $mandatePath,
            'mandate_file_name' => $mandateName,
            'status' => $validated['status'],
        ]);

        return redirect()->route('departments.show', $department->id)
            ->with('success', 'Department created successfully.');
    }

    public function update(Request $request, Department $department): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10',
            'description' => 'nullable|string',
            'director_id' => 'nullable|exists:users,id',
            'location' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,archived',
            'mandate_file' => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240',
        ]);

        $mandatePath = $department->mandate_file_path;
        $mandateName = $department->mandate_file_name;

        if ($request->hasFile('mandate_file')) {
            if ($mandatePath && Storage::exists($mandatePath)) {
                Storage::delete($mandatePath);
            }
            $file = $request->file('mandate_file');
            $mandateName = $file->getClientOriginalName();
            $mandatePath = $file->store('mandates');
        }

        $department->update([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'description' => $validated['description'] ?? null,
            'director_id' => $validated['director_id'] ?? null,
            'location' => $validated['location'] ?? null,
            'mandate_file_path' => $mandatePath,
            'mandate_file_name' => $mandateName,
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        if ($department->mandate_file_path && Storage::exists($department->mandate_file_path)) {
            Storage::delete($department->mandate_file_path);
        }

        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Department removed successfully.');
    }

    public function downloadMandate(Department $department): StreamedResponse|RedirectResponse
    {
        if (! $department->mandate_file_path || ! Storage::exists($department->mandate_file_path)) {
            return back()->with('error', 'No mandate document is available for download.');
        }

        return Storage::download($department->mandate_file_path, $department->mandate_file_name);
    }
}
