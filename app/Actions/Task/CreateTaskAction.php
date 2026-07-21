<?php

namespace App\Actions\Task;

use App\Models\Task;
use App\Models\TaskActivity;

class CreateTaskAction
{
    public function execute(array $data, int $creatorId, int $workspaceId = 1): Task
    {
        $data['workspace_id'] = $workspaceId;
        $data['creator_id'] = $creatorId;

        // Calculate next position for the column
        $data['position'] = Task::where('board_column_id', $data['board_column_id'])->max('position') + 1;

        $task = Task::create($data);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $creatorId,
            'action' => 'created',
            'details' => ['title' => $task->title],
        ]);

        return $task;
    }
}
