<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'file_path',
        'file_size',
        'file_type',
        'folder_name',
        'uploaded_by',
    ];

    protected $appends = [
        'is_media',
        'formatted_size',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getIsMediaAttribute(): bool
    {
        $mediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/quicktime'];
        if ($this->file_type && in_array(strtolower($this->file_type), $mediaTypes)) {
            return true;
        }

        $extension = strtolower(pathinfo($this->file_path, PATHINFO_EXTENSION));

        return in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'mov']);
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2).' GB';
        }
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1).' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 0).' KB';
        }

        return $bytes.' B';
    }
}
