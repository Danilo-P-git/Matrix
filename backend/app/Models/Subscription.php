<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'activity_id',
        'exit_date',
    ];

    protected function casts(): array
    {
        return [
            'exit_date' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this subscription
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the activity that owns this subscription
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Get all equipment assigned to this subscription
     */
    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }
}
