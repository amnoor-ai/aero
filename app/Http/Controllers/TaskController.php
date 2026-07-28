<?php

namespace App\Http\Controllers;

use App\Actions\Task\CreateTaskAction;
use App\Actions\Task\UpdateTaskAction;
use App\Actions\Task\UpdateTaskPositionAction;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskPositionRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\BoardColumn;
use App\Models\DepartmentDocument;
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

        $validated = $request->validated();
        if (empty($validated['board_column_id']) && ! empty($validated['project_id'])) {
            $firstCol = BoardColumn::where('project_id', $validated['project_id'])->orderBy('position')->first();
            $validated['board_column_id'] = $firstCol?->id ?? 1;
        } elseif (empty($validated['board_column_id'])) {
            $validated['board_column_id'] = 1;
        }

        $createTaskAction->execute($validated, $creatorId, $workspaceId);

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

        $task->touch();

        return back();
    }

    public function toggleChecklist(TaskChecklist $checklist): RedirectResponse
    {
        $checklist->update(['is_completed' => ! $checklist->is_completed]);
        $checklist->task?->touch();

        return back();
    }

    public function deleteChecklist(TaskChecklist $checklist): RedirectResponse
    {
        $task = $checklist->task;
        $checklist->delete();
        $task?->touch();

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

    public function uploadDocument(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'file' => 'required|file|max:51200',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $displayName = ! empty($validated['name']) ? $validated['name'] : "[TASK-#{$task->id}] {$originalName}";
        $path = $file->store('department-documents');
        $extension = strtolower($file->getClientOriginalExtension());

        $deptId = $task->project?->department_id ?? 1;

        $doc = DepartmentDocument::create([
            'department_id' => $deptId,
            'name' => $displayName,
            'file_path' => $path,
            'file_type' => $extension,
            'file_size' => $file->getSize(),
            'uploaded_by_id' => $request->user()?->id ?? 1,
        ]);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $request->user()?->id ?? 1,
            'action' => 'document_uploaded',
            'details' => ['document_name' => $displayName, 'document_id' => $doc->id],
        ]);

        return back()->with('success', 'Document uploaded and attached successfully.');
    }
}
