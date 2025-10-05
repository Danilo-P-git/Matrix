<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Activity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'note',
        'year_id',
        'cost',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'cost' => 'decimal:2',
        ];
    }

    /**
     * Get the year that owns this activity
     */
    public function year(): BelongsTo
    {
        return $this->belongsTo(Year::class);
    }

    /**
     * Get all subscriptions for this activity
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get all payments for this activity
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all documents associated with this activity
     */
    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_activities')
                    ->withPivot('user_id', 'event_id')
                    ->withTimestamps();
    }

    /**
     * Get all document activities for this activity
     */
    public function documentActivities(): HasMany
    {
        return $this->hasMany(DocumentActivity::class);
    }
}
