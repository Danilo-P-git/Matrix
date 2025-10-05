<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Equipment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'quantity',
        'code',
        'type',
        'year_id',
        'subscription_id',
        'assign_date',
        'return_date',
        'status',
        'is_available_for_sale',
        'condition',
        'size',
        'note',
        'event_id',
    ];

    protected function casts(): array
    {
        return [
            'assign_date' => 'datetime',
            'return_date' => 'datetime',
            'is_available_for_sale' => 'boolean',
        ];
    }

    /**
     * Get the year that owns this equipment
     */
    public function year(): BelongsTo
    {
        return $this->belongsTo(Year::class);
    }

    /**
     * Get the subscription that owns this equipment (optional)
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Get the event that owns this equipment (optional)
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the user through subscription
     */
    public function user()
    {
        return $this->hasOneThrough(User::class, Subscription::class, 'id', 'id', 'subscription_id', 'user_id');
    }
}
