<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'location',
        'start_time',
        'end_time',
        'status',
        'is_full',
        'cost',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'is_full' => 'boolean',
            'cost' => 'decimal:2',
        ];
    }

    /**
     * Get all document activities for this event
     */
    public function documentActivities(): HasMany
    {
        return $this->hasMany(DocumentActivity::class);
    }

    /**
     * Get all equipment for this event
     */
    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    /**
     * Get all payments for this event
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all attendances for this event
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
