<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\DepartmentDocument;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentationController extends Controller
{
    /**
     * Display global central documentation directory across projects and departments.
     */
    public function index(Request $request): Response
    {
        $workspaceId = 1;

        $departments = Department::where('workspace_id', $workspaceId)
            ->select('id', 'name', 'code')
            ->get();

        $projects = Project::where('workspace_id', $workspaceId)
            ->select('id', 'name', 'department_id')
            ->get();

        $query = DepartmentDocument::with(['department', 'uploadedBy'])
            ->whereHas('department', function ($q) use ($workspaceId) {
                $q->where('workspace_id', $workspaceId);
            });

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('file_type', 'like', "%{$search}%")
                    ->orWhereHas('department', function ($deptQ) use ($search) {
                        $deptQ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    })
                    ->orWhereHas('uploadedBy', function ($userQ) use ($search) {
                        $userQ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->input('department_id'));
        }

        if ($request->filled('file_type')) {
            $type = strtolower($request->input('file_type'));
            if ($type === 'pdf') {
                $query->where('file_type', 'pdf');
            } elseif ($type === 'images') {
                $query->whereIn('file_type', ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp']);
            } elseif ($type === 'docs') {
                $query->whereIn('file_type', ['doc', 'docx', 'txt', 'rtf', 'odt', 'csv', 'xlsx']);
            } elseif ($type === 'archives') {
                $query->whereIn('file_type', ['zip', 'rar', 'tar', 'gz', '7z']);
            }
        }

        $documents = $query->latest()->paginate(20)->withQueryString();

        // Calculate statistics
        $allDocs = DepartmentDocument::whereHas('department', function ($q) use ($workspaceId) {
            $q->where('workspace_id', $workspaceId);
        })->get();

        $totalBytes = $allDocs->sum('file_size');
        $formattedStorage = $this->formatBytes($totalBytes);

        $stats = [
            'total_documents' => $allDocs->count(),
            'total_storage' => $formattedStorage,
            'departments_count' => $departments->count(),
            'projects_count' => $projects->count(),
            'recent_count' => $allDocs->where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return Inertia::render('Documentation/Index', [
            'documents' => $documents,
            'departments' => $departments,
            'projects' => $projects,
            'stats' => $stats,
            'filters' => $request->only(['search', 'department_id', 'file_type']),
        ]);
    }

    /**
     * Format bytes to human readable string (KB, MB, GB).
     */
    private function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = (int) floor(log($bytes, 1024));

        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }
}
