<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use App\Models\Department;
use App\Models\Milestone;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TaskDirectoryController extends Controller
{
    public function index(Request $request): Response
    {
        $workspaceId = 1;

        $query = Task::where('workspace_id', $workspaceId)
            ->with([
                'project',
                'boardColumn',
                'assignee',
                'creator',
                'sprint',
                'milestone',
                'checklists',
                'comments.user',
            ]);

        // Search text
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhereHas('assignee', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filters
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->whereHas('boardColumn', function ($q) use ($status) {
                $q->where('name', $status);
            });
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->input('project_id'));
        }

        if ($request->filled('assignee_id')) {
            $query->where('assignee_id', $request->input('assignee_id'));
        }

        if ($request->filled('department_id')) {
            $deptId = $request->input('department_id');
            $query->whereHas('project', function ($q) use ($deptId) {
                $q->where('department_id', $deptId);
            });
        }

        if ($request->filled('due_date_from')) {
            $query->whereDate('due_date', '>=', $request->input('due_date_from'));
        }

        if ($request->filled('due_date_to')) {
            $query->whereDate('due_date', '<=', $request->input('due_date_to'));
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $order = strtolower($request->input('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        switch ($sortBy) {
            case 'title':
                $query->orderBy('title', $order);
                break;
            case 'priority':
                $query->orderBy('priority', $order);
                break;
            case 'due_date':
                $query->orderBy('due_date', $order);
                break;
            case 'project':
                $query->join('projects', 'tasks.project_id', '=', 'projects.id')
                    ->orderBy('projects.name', $order)
                    ->select('tasks.*');
                break;
            case 'status':
                $query->join('board_columns', 'tasks.board_column_id', '=', 'board_columns.id')
                    ->orderBy('board_columns.name', $order)
                    ->select('tasks.*');
                break;
            default:
                $query->orderBy('tasks.created_at', $order);
                break;
        }

        $tasks = $query->paginate(15)->withQueryString();

        $projects = Project::where('workspace_id', $workspaceId)->select('id', 'name')->get();
        $departments = Department::where('workspace_id', $workspaceId)->select('id', 'name')->get();
        $users = User::select('id', 'name')->get();
        $milestones = Milestone::where('workspace_id', $workspaceId)->select('id', 'name', 'project_id')->get();
        $boardColumns = BoardColumn::select('id', 'name', 'project_id', 'color', 'position')->orderBy('position')->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'projects' => $projects,
            'departments' => $departments,
            'users' => $users,
            'milestones' => $milestones,
            'boardColumns' => $boardColumns,
            'filters' => $request->only([
                'search', 'status', 'priority', 'project_id',
                'assignee_id', 'department_id', 'due_date_from',
                'due_date_to', 'sort_by', 'order',
            ]),
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $workspaceId = 1;

        $query = Task::where('workspace_id', $workspaceId)
            ->with(['project', 'boardColumn', 'assignee', 'creator']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->whereHas('boardColumn', function ($q) use ($status) {
                $q->where('name', $status);
            });
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->input('project_id'));
        }

        if ($request->filled('assignee_id')) {
            $query->where('assignee_id', $request->input('assignee_id'));
        }

        $tasks = $query->latest()->get();

        $filename = 'aero-tasks-export-'.now()->format('Y-m-d').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($tasks) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Task ID', 'Title', 'Project', 'Status', 'Priority', 'Story Points', 'Assignee', 'Creator', 'Due Date', 'Created At']);

            foreach ($tasks as $task) {
                fputcsv($file, [
                    'TASK-'.$task->id,
                    $task->title,
                    $task->project?->name ?? 'Unassigned',
                    $task->boardColumn?->name ?? 'Backlog',
                    strtoupper($task->priority),
                    $task->story_points ?? 0,
                    $task->assignee?->name ?? 'Unassigned',
                    $task->creator?->name ?? 'System',
                    $task->due_date ? $task->due_date->format('Y-m-d') : 'No Due Date',
                    $task->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
