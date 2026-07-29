<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'name',
        'code',
        'slug',
        'description',
        'director_id',
        'location',
        'mandate_file_path',
        'mandate_file_name',
        'status',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function director(): BelongsTo
    {
        return $this->belongsTo(User::class, 'director_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DepartmentDocument::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
