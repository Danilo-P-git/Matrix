<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $appends = ['all_permissions'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'permissions', // Nascondi permessi diretti
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAllPermissionsAttribute()
    {
        // Assicura che roles.permissions sia già caricata per evitare query extra
        if (!$this->relationLoaded('roles')) {
            $this->load('roles.permissions');
        }
        return $this->getAllPermissions()->unique('id')->values();
    }

    /**
     * Get all documents for this user
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get all subscriptions for this user
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get all payments for this user
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all document activities for this user
     */
    public function documentActivities()
    {
        return $this->hasMany(DocumentActivity::class);
    }

    /**
     * Get all equipment through subscriptions
     */
    public function equipment()
    {
        return $this->hasManyThrough(Equipment::class, Subscription::class);
    }

    /**
     * Get all attendances for this user
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
