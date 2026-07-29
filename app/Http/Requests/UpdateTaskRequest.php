<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
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
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'department_id' => 'nullable|exists:departments,id',
            'board_column_id' => 'sometimes|required|exists:board_columns,id',
            'priority' => 'sometimes|required|string|in:low,medium,high,urgent',
            'type' => 'sometimes|required|string|in:bug,feature,improvement,task',
            'assignee_id' => 'nullable|exists:users,id',
            'story_points' => 'nullable|integer',
            'due_date' => 'nullable|date',
            'git_branch' => 'nullable|string',
        ];
    }
}
