<?php

namespace App\Http\Controllers;

use App\Actions\Task\CreateTaskAction;
use App\Actions\Task\UpdateTaskAction;
use App\Actions\Task\UpdateTaskPositionAction;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskPositionRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\TaskActivity;
use App\Models\TaskChecklist;
use App\Models\TaskComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    public function store(
        StoreTaskRequest $request,
        CreateTaskAction $createTaskAction
    ): RedirectResponse {
        $creatorId = $request->user()?->id ?? 1;
        $workspaceId = 1;

        $createTaskAction->execute($request->validated(), $creatorId, $workspaceId);

        return back()->with('success', 'Task created successfully.');
    }

    public function update(
        UpdateTaskRequest $request,
        Task $task,
        UpdateTaskAction $updateTaskAction
    ): RedirectResponse {
        $userId = $request->user()?->id ?? 1;

        $updateTaskAction->execute($task, $request->validated(), $userId);

        return back()->with('success', 'Task updated.');
    }

    public function updatePosition(
        UpdateTaskPositionRequest $request,
        Task $task,
        UpdateTaskPositionAction $updateTaskPositionAction
    ): RedirectResponse {
        $userId = $request->user()?->id ?? 1;

        $updateTaskPositionAction->execute($task, $request->validated(), $userId);

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
