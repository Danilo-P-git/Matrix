<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'note',
        'path',
        'type',
        'user_id',
    ];

    /**
     * Get the user that owns this document
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all activities associated with this document
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'document_activities')
                    ->withPivot('user_id', 'event_id')
                    ->withTimestamps();
    }

    /**
     * Get all document activities for this document
     */
    public function documentActivities(): HasMany
    {
        return $this->hasMany(DocumentActivity::class);
    }
}
