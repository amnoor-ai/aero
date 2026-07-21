<?php

namespace App\Actions\Task;

use App\Models\Task;
use App\Models\TaskActivity;

class UpdateTaskPositionAction
{
    public function execute(Task $task, array $data, int $userId): void
    {
        $oldColumnId = $task->board_column_id;

        $task->update([
            'board_column_id' => $data['board_column_id'],
            'position' => $data['position'],
        ]);

        if ($oldColumnId !== $data['board_column_id']) {
            TaskActivity::create([
                'task_id' => $task->id,
                'user_id' => $userId,
                'action' => 'moved_column',
                'details' => ['from_column' => $oldColumnId, 'to_column' => $data['board_column_id']],
            ]);
        }
    }
}
