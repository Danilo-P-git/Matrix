<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentActivity extends Model
{
    protected $fillable = [
        'document_id',
        'activity_id',
        'user_id',
        'event_id',
    ];

    /**
     * Get the document that owns this pivot
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * Get the activity that owns this pivot
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Get the user that owns this pivot
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event associated with this pivot
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
