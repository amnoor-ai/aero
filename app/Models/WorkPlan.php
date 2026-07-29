<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WorkPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'name',
        'description',
        'status',
        'start_date',
        'due_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
    ];

    protected $appends = ['progress'];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_work_plan')
            ->withTimestamps();
    }

    protected function progress(): Attribute
    {
        return Attribute::make(
            get: function (): int {
                $projects = $this->projects;
                if ($projects->isEmpty()) {
                    return 0;
                }

                $totalProgress = $projects->sum(fn ($p) => $p->progress);

                return (int) round($totalProgress / $projects->count());
            }
        );
    }
}
