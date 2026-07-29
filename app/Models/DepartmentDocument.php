<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentDocument extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'department_id',
        'name',
        'file_path',
        'file_type',
        'file_size',
        'uploaded_by_id',
    ];

    protected $appends = [
        'view_url',
        'download_url',
    ];

    /**
     * Get the department that owns the document.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the user who uploaded the document.
     */
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }

    public function getViewUrlAttribute(): string
    {
        return "/departments/documents/{$this->id}/view";
    }

    public function getDownloadUrlAttribute(): string
    {
        return "/departments/documents/{$this->id}/download";
    }
}
