<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    // Esempio di rotta protetta con permessi Spatie
    Route::get('/admin/users', function (Request $request) {
        return $request->user()->can('view users')
            ? response()->json(['users' => App\Models\User::all()])
            : response()->json(['error' => 'Unauthorized'], 403);
    });
});
