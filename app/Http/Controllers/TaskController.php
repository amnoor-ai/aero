<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskActivity;
use App\Models\TaskChecklist;
use App\Models\TaskComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'board_column_id' => 'required|exists:board_columns,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:bug,feature,improvement,task',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'story_points' => 'nullable|integer|min:0',
            'assignee_id' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'git_branch' => 'nullable|string|max:255',
        ]);

        $workspaceId = 1;
        $creatorId = $request->user()?->id ?? 1;

        $task = Task::create([
            'workspace_id' => $workspaceId,
            'project_id' => $validated['project_id'],
            'board_column_id' => $validated['board_column_id'],
            'sprint_id' => $validated['sprint_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'story_points' => $validated['story_points'] ?? null,
            'creator_id' => $creatorId,
            'assignee_id' => $validated['assignee_id'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'git_branch' => $validated['git_branch'] ?? null,
            'position' => Task::where('board_column_id', $validated['board_column_id'])->max('position') + 1,
        ]);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $creatorId,
            'action' => 'created',
            'details' => ['title' => $task->title],
        ]);

        return back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'board_column_id' => 'sometimes|required|exists:board_columns,id',
            'priority' => 'sometimes|required|string|in:low,medium,high,urgent',
            'type' => 'sometimes|required|string|in:bug,feature,improvement,task',
            'assignee_id' => 'nullable|exists:users,id',
            'story_points' => 'nullable|integer',
            'due_date' => 'nullable|date',
            'git_branch' => 'nullable|string',
        ]);

        $task->update($validated);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $request->user()?->id ?? 1,
            'action' => 'updated',
            'details' => $validated,
        ]);

        return back()->with('success', 'Task updated.');
    }

    public function updatePosition(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'board_column_id' => 'required|exists:board_columns,id',
            'position' => 'required|integer|min:0',
        ]);

        $oldColumnId = $task->board_column_id;
        $task->update([
            'board_column_id' => $validated['board_column_id'],
            'position' => $validated['position'],
        ]);

        if ($oldColumnId !== $validated['board_column_id']) {
            TaskActivity::create([
                'task_id' => $task->id,
                'user_id' => $request->user()?->id ?? 1,
                'action' => 'moved_column',
                'details' => ['from_column' => $oldColumnId, 'to_column' => $validated['board_column_id']],
            ]);
        }

        return back();
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return back()->with('success', 'Task deleted.');
    }

    public function addChecklist(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        TaskChecklist::create([
            'task_id' => $task->id,
            'title' => $validated['title'],
            'is_completed' => false,
            'position' => $task->checklists()->max('position') + 1,
        ]);

        return back();
    }

    public function toggleChecklist(TaskChecklist $checklist): RedirectResponse
    {
        $checklist->update(['is_completed' => ! $checklist->is_completed]);

        return back();
    }

    public function addComment(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        TaskComment::create([
            'task_id' => $task->id,
            'user_id' => $request->user()?->id ?? 1,
            'content' => $validated['content'],
        ]);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $request->user()?->id ?? 1,
            'action' => 'comment_added',
            'details' => ['comment' => Str::limit($validated['content'], 40)],
        ]);

        return back();
    }
}
