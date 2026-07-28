<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'board_column_id' => 'nullable|exists:board_columns,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'milestone_id' => 'nullable|exists:milestones,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:bug,feature,improvement,task,activity',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'story_points' => 'nullable|integer|min:0',
            'assignee_id' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'git_branch' => 'nullable|string|max:255',
        ];
    }
}
