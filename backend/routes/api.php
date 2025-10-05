<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\YearController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AttendanceController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    // Year CRUD API routes
    Route::apiResource('years', YearController::class);
    
    // Additional Year routes for soft delete management
    Route::get('/years-with-trashed', [YearController::class, 'indexWithTrashed']);
    Route::get('/years-trashed', [YearController::class, 'onlyTrashed']);
    Route::patch('/years/{id}/restore', [YearController::class, 'restore']);
    Route::delete('/years/{id}/force-delete', [YearController::class, 'forceDelete']);
    Route::get('/years/{year}/statistics', [YearController::class, 'statistics']);

    // Activity CRUD API routes
    Route::apiResource('activities', ActivityController::class);
    
    // Additional Activity routes for soft delete management
    Route::get('/activities-with-trashed', [ActivityController::class, 'indexWithTrashed']);
    Route::get('/activities-trashed', [ActivityController::class, 'onlyTrashed']);
    Route::patch('/activities/{id}/restore', [ActivityController::class, 'restore']);
    Route::delete('/activities/{id}/force-delete', [ActivityController::class, 'forceDelete']);
    Route::get('/activities/{activity}/statistics', [ActivityController::class, 'statistics']);
    Route::get('/activities/year/{yearId}', [ActivityController::class, 'getByYear']);
    Route::get('/activities/search', [ActivityController::class, 'search']);

    // Document CRUD API routes
    Route::apiResource('documents', DocumentController::class);
    Route::get('/documents/user/{userId}', [DocumentController::class, 'getByUser']);

    // Equipment CRUD API routes
    Route::apiResource('equipment', EquipmentController::class);
    Route::get('/equipment/status/{status}', [EquipmentController::class, 'getByStatus']);
    Route::patch('/equipment/{equipment}/assign', [EquipmentController::class, 'assign']);

    // Event CRUD API routes
    Route::apiResource('events', EventController::class);
    Route::get('/events/status/{status}', [EventController::class, 'getByStatus']);
    Route::get('/events/{event}/statistics', [EventController::class, 'statistics']);

    // Payment CRUD API routes
    Route::apiResource('payments', PaymentController::class);
    Route::get('/payments/user/{userId}', [PaymentController::class, 'getByUser']);
    Route::get('/payments/status/{status}', [PaymentController::class, 'getByStatus']);
    Route::patch('/payments/{payment}/mark-paid', [PaymentController::class, 'markAsPaid']);

    // Subscription CRUD API routes
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::get('/subscriptions/user/{userId}', [SubscriptionController::class, 'getByUser']);
    Route::get('/subscriptions/activity/{activityId}', [SubscriptionController::class, 'getByActivity']);
    Route::get('/subscriptions/active', [SubscriptionController::class, 'getActiveSubscriptions']);
    Route::patch('/subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancelSubscription']);

    // Attendance CRUD API routes
    Route::apiResource('attendances', AttendanceController::class);
    Route::post('/attendances/{id}/restore', [AttendanceController::class, 'restore']);
    Route::get('/attendances/event/{eventId}', [AttendanceController::class, 'getByEvent']);
    Route::get('/attendances/user/{userId}', [AttendanceController::class, 'getByUser']);
    Route::get('/attendances/status/{status}', [AttendanceController::class, 'getByStatus']);
    Route::patch('/attendances/{attendance}/mark-present', [AttendanceController::class, 'markAsPresent']);
    Route::patch('/attendances/{attendance}/mark-absent', [AttendanceController::class, 'markAsAbsent']);
    Route::patch('/attendances/{attendance}/set-exit-date', [AttendanceController::class, 'setExitDate']);
    Route::get('/attendances/statistics', [AttendanceController::class, 'statistics']);

    // Esempio di rotta protetta con permessi Spatie
    Route::get('/admin/users', function (Request $request) {
        return $request->user()->can('view users')
            ? response()->json(['users' => App\Models\User::all()])
            : response()->json(['error' => 'Unauthorized'], 403);
    });
});
