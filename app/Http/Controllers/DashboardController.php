<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $workspaceId = 1; // Default V1 workspace

        $totalProjects = Project::where('workspace_id', $workspaceId)->count();
        $totalTasks = Task::where('workspace_id', $workspaceId)->count();

        $completedTasks = Task::where('workspace_id', $workspaceId)
            ->whereHas('boardColumn', function ($query) {
                $query->where('name', 'Done');
            })
            ->count();

        $overdueTasks = Task::where('workspace_id', $workspaceId)
            ->where('due_date', '<', now()->startOfDay())
            ->whereDoesntHave('boardColumn', function ($query) {
                $query->where('name', 'Done');
            })
            ->count();

        $completionRate = $totalTasks > 0 ? (int) round(($completedTasks / $totalTasks) * 100) : 0;
        $overdueRatio = $totalTasks > 0 ? (int) round(($overdueTasks / $totalTasks) * 100) : 0;

        $activeSprint = Sprint::where('workspace_id', $workspaceId)
            ->where('status', 'active')
            ->with(['project', 'tasks.assignee', 'tasks.boardColumn'])
            ->first();

        $recentProjects = Project::where('workspace_id', $workspaceId)
            ->with('lead')
            ->withCount('tasks')
            ->latest('updated_at')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'metrics' => [
                'totalProjects' => $totalProjects,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'overdueTasks' => $overdueTasks,
                'completionRate' => $completionRate,
                'onTimeRate' => max(0, 100 - $overdueRatio),
                'overdueRatio' => $overdueRatio,
            ],
            'activeSprint' => $activeSprint,
            'recentProjects' => $recentProjects,
        ]);
    }
}
