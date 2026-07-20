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
        $timeframe = $request->input('timeframe', 'month');

        $query = Task::where('workspace_id', $workspaceId);

        if ($timeframe === 'today') {
            $query->whereDate('created_at', now()->today());
        } elseif ($timeframe === 'week') {
            $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        }

        $totalTasks = (clone $query)->count();
        $completedTasks = (clone $query)
            ->whereHas('boardColumn', fn ($q) => $q->where('name', 'Done'))
            ->count();

        $overdueTasks = (clone $query)
            ->where('due_date', '<', now()->startOfDay())
            ->whereDoesntHave('boardColumn', fn ($q) => $q->where('name', 'Done'))
            ->count();

        $todoCount = (clone $query)
            ->whereHas('boardColumn', fn ($q) => $q->whereIn('name', ['Backlog', 'To Do']))
            ->count();

        $inProgressCount = (clone $query)
            ->whereHas('boardColumn', fn ($q) => $q->where('name', 'In Progress'))
            ->count();

        $inReviewCount = (clone $query)
            ->whereHas('boardColumn', fn ($q) => $q->where('name', 'In Review'))
            ->count();

        $totalProjects = Project::where('workspace_id', $workspaceId)->count();
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
                'todoCount' => $todoCount,
                'inProgressCount' => $inProgressCount,
                'inReviewCount' => $inReviewCount,
                'doneCount' => $completedTasks,
            ],
            'timeframe' => $timeframe,
            'activeSprint' => $activeSprint,
            'recentProjects' => $recentProjects,
        ]);
    }
}
