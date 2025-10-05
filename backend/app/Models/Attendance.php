<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'event_id',
        'note',
        'status',
        'exit_date',
        'is_outsider',
    ];

    protected function casts(): array
    {
        return [
            'exit_date' => 'datetime',
            'is_outsider' => 'boolean',
        ];
    }

    /**
     * Get the user that owns this attendance
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event that owns this attendance
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
