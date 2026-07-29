<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Milestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'project_id',
        'work_plan_id',
        'name',
        'description',
        'start_date',
        'due_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
    ];

    protected $appends = ['progress', 'is_overdue'];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function workPlan(): BelongsTo
    {
        return $this->belongsTo(WorkPlan::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    protected function progress(): Attribute
    {
        return Attribute::make(
            get: function (): int {
                $total = $this->tasks()->count();
                if ($total === 0) {
                    return 0;
                }

                $completed = $this->tasks()
                    ->whereHas('boardColumn', function ($query) {
                        $query->where('name', 'Done');
                    })
                    ->count();

                return (int) round(($completed / $total) * 100);
            }
        );
    }

    protected function isOverdue(): Attribute
    {
        return Attribute::make(
            get: function (): bool {
                if (! $this->due_date || $this->progress >= 100) {
                    return false;
                }

                return $this->due_date->isPast();
            }
        );
    }
}
