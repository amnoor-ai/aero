<?php

namespace App\Actions\Task;

use App\Models\Task;
use App\Models\TaskActivity;

class UpdateTaskAction
{
    public function execute(Task $task, array $data, int $userId): void
    {
        $task->update($data);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $userId,
            'action' => 'updated',
            'details' => $data,
        ]);
    }
}
