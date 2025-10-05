<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'activity_id',
        'event_id',
        'amount',
        'description',
        'type_of_payment',
        'status',
        'is_partial',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_partial' => 'boolean',
        ];
    }

    /**
     * Get the user that owns this payment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the activity that owns this payment (optional)
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Get the event that owns this payment (optional)
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
