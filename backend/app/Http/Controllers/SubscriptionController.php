<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;

class SubscriptionController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $subscriptions = Subscription::with(['user', 'activity', 'equipment'])
                                      ->orderBy('created_at', 'desc')
                                      ->get();

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
                'message' => 'Iscrizioni recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle iscrizioni',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreSubscriptionRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $subscription = Subscription::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $subscription->load(['user', 'activity', 'equipment']),
                'message' => 'Iscrizione creata con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella creazione dell\'iscrizione',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Subscription $subscription): JsonResponse
    {
        try {
            $subscription->load(['user', 'activity.year', 'equipment']);

            return response()->json([
                'success' => true,
                'data' => $subscription,
                'message' => 'Iscrizione recuperata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dell\'iscrizione',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateSubscriptionRequest $request, Subscription $subscription): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $subscription->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $subscription->fresh(['user', 'activity', 'equipment']),
                'message' => 'Iscrizione aggiornata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'aggiornamento dell\'iscrizione',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Subscription $subscription): JsonResponse
    {
        try {
            $equipmentCount = $subscription->equipment()->count();
            
            if ($equipmentCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Impossibile eliminare l'iscrizione con {$equipmentCount} equipaggiamenti associati.",
                    'data' => ['equipment_count' => $equipmentCount]
                ], 400);
            }

            $subscription->delete();

            return response()->json([
                'success' => true,
                'message' => 'Iscrizione eliminata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione dell\'iscrizione',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByUser($userId): JsonResponse
    {
        try {
            $subscriptions = Subscription::where('user_id', $userId)
                                      ->with(['activity.year', 'equipment'])
                                      ->orderBy('created_at', 'desc')
                                      ->get();

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
                'message' => 'Iscrizioni utente recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle iscrizioni utente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByActivity($activityId): JsonResponse
    {
        try {
            $subscriptions = Subscription::where('activity_id', $activityId)
                                      ->with(['user', 'equipment'])
                                      ->orderBy('created_at', 'desc')
                                      ->get();

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
                'message' => 'Iscrizioni per attività recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle iscrizioni per attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getActiveSubscriptions(): JsonResponse
    {
        try {
            $subscriptions = Subscription::whereNull('exit_date')
                                      ->with(['user', 'activity.year', 'equipment'])
                                      ->orderBy('created_at', 'desc')
                                      ->get();

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
                'message' => 'Iscrizioni attive recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle iscrizioni attive',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cancelSubscription(Subscription $subscription): JsonResponse
    {
        try {
            $subscription->update(['exit_date' => now()]);

            return response()->json([
                'success' => true,
                'data' => $subscription->fresh(['user', 'activity', 'equipment']),
                'message' => 'Iscrizione cancellata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella cancellazione dell\'iscrizione',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
