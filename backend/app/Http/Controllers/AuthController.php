<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        try {
          $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'string|nullable'
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            // Revoke existing tokens for this device (optional)
            $deviceName = $request->device_name ?? 'web-app';
            $user->tokens()->where('name', $deviceName)->delete();

            // Create new token
            $token = $user->createToken($deviceName)->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $th->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }

    }

    /**
     * Register new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'device_name' => 'string|nullable'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign default role if using Spatie Permission
        $user->assignRole('user'); // Assicurati di creare questo ruolo nei seeders

        $deviceName = $request->device_name ?? 'web-app';
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], Response::HTTP_CREATED);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        $user = User::find($request->user()->id);
        $user->load('roles');
        // Carica ruoli e permessi

        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ], Response::HTTP_OK);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Successfully logged out from all devices'
        ], Response::HTTP_OK);
    }
}
