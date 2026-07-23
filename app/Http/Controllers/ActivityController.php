<?php

namespace App\Http\Controllers;

use App\Models\TaskActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $workspaceId = 1;

        $query = TaskActivity::whereHas('task', function ($q) use ($workspaceId) {
            $q->where('workspace_id', $workspaceId);
        })
            ->with(['user', 'task.project'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('task', function ($t) use ($search) {
                        $t->where('title', 'like', "%{$search}%");
                    });
            });
        }

        $activities = $query->paginate(20)->withQueryString();

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search']),
        ]);
    }
}
