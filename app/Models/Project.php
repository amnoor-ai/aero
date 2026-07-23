<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'department_id',
        'name',
        'slug',
        'description',
        'status',
        'lead_id',
        'start_date',
        'due_date',
        'budget',
        'tags',
        'logo_path',
        'is_starred',
    ];

    protected $casts = [
        'is_starred' => 'boolean',
        'start_date' => 'date',
        'due_date' => 'date',
        'budget' => 'decimal:2',
        'tags' => 'array',
    ];

    protected $appends = ['progress'];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lead_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function boardColumns(): HasMany
    {
        return $this->hasMany(BoardColumn::class)->orderBy('position');
    }

    public function sprints(): HasMany
    {
        return $this->hasMany(Sprint::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
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

                // Check for tasks in 'Done' board column
                $completed = $this->tasks()
                    ->whereHas('boardColumn', function ($query) {
                        $query->where('name', 'Done');
                    })
                    ->count();

                return (int) round(($completed / $total) * 100);
            }
        );
    }
}
