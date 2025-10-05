<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;

class ActivityController extends Controller
{
    /**
     * Display a listing of the activities.
     */
    public function index(): JsonResponse
    {
        try {
            $activities = Activity::with(['year', 'subscriptions', 'payments', 'documents'])
                                ->orderBy('start_date', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Attività recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created activity in storage.
     */
    public function store(StoreActivityRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $activity = Activity::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $activity->load(['year', 'subscriptions', 'payments', 'documents']),
                'message' => 'Attività creata con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella creazione dell\'attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified activity.
     */
    public function show(Activity $activity): JsonResponse
    {
        try {
            $activity->load(['year', 'subscriptions.user', 'payments.user', 'documents', 'documentActivities']);

            return response()->json([
                'success' => true,
                'data' => $activity,
                'message' => 'Attività recuperata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dell\'attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified activity in storage.
     */
    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $activity->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $activity->fresh(['year', 'subscriptions', 'payments', 'documents']),
                'message' => 'Attività aggiornata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'aggiornamento dell\'attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified activity from storage (soft delete).
     */
    public function destroy(Activity $activity): JsonResponse
    {
        try {
            // Check if activity has associated subscriptions or payments
            $subscriptionsCount = $activity->subscriptions()->count();
            $paymentsCount = $activity->payments()->count();
            $documentsCount = $activity->documents()->count();
            
            if ($subscriptionsCount > 0 || $paymentsCount > 0 || $documentsCount > 0) {
                $message = 'Impossibile eliminare l\'attività con ';
                $dependencies = [];
                
                if ($subscriptionsCount > 0) {
                    $dependencies[] = $subscriptionsCount . ' iscrizioni associate';
                }
                
                if ($paymentsCount > 0) {
                    $dependencies[] = $paymentsCount . ' pagamenti associati';
                }
                
                if ($documentsCount > 0) {
                    $dependencies[] = $documentsCount . ' documenti associati';
                }
                
                return response()->json([
                    'success' => false,
                    'message' => $message . implode(', ', $dependencies) . '.',
                    'data' => [
                        'subscriptions_count' => $subscriptionsCount,
                        'payments_count' => $paymentsCount,
                        'documents_count' => $documentsCount
                    ]
                ], 400);
            }

            $activity->delete();

            return response()->json([
                'success' => true,
                'message' => 'Attività eliminata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione dell\'attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a soft deleted activity.
     */
    public function restore($id): JsonResponse
    {
        try {
            $activity = Activity::withTrashed()->findOrFail($id);
            $activity->restore();

            return response()->json([
                'success' => true,
                'data' => $activity->fresh(['year', 'subscriptions', 'payments', 'documents']),
                'message' => 'Attività ripristinata con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel ripristino dell\'attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Force delete an activity (permanent deletion).
     */
    public function forceDelete($id): JsonResponse
    {
        try {
            $activity = Activity::withTrashed()->findOrFail($id);
            $activity->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Attività eliminata definitivamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'eliminazione definitiva dell\'attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all activities including soft deleted ones.
     */
    public function indexWithTrashed(): JsonResponse
    {
        try {
            $activities = Activity::withTrashed()
                                ->with(['year', 'subscriptions', 'payments', 'documents'])
                                ->orderBy('start_date', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Attività con eliminate recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle attività con eliminate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get only soft deleted activities.
     */
    public function onlyTrashed(): JsonResponse
    {
        try {
            $activities = Activity::onlyTrashed()
                                ->with(['year', 'subscriptions', 'payments', 'documents'])
                                ->orderBy('deleted_at', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Attività eliminate recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle attività eliminate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get activities by year.
     */
    public function getByYear($yearId): JsonResponse
    {
        try {
            $activities = Activity::where('year_id', $yearId)
                                ->with(['year', 'subscriptions', 'payments', 'documents'])
                                ->orderBy('start_date', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Attività per anno recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle attività per anno',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics about a specific activity.
     */
    public function statistics(Activity $activity): JsonResponse
    {
        try {
            $stats = [
                'activity_info' => [
                    'id' => $activity->id,
                    'name' => $activity->name,
                    'start_date' => $activity->start_date,
                    'end_date' => $activity->end_date,
                    'cost' => $activity->cost,
                ],
                'subscriptions_count' => $activity->subscriptions()->count(),
                'payments_count' => $activity->payments()->count(),
                'documents_count' => $activity->documents()->count(),
                'total_revenue' => $activity->payments()->sum('amount'),
                'active_subscriptions' => $activity->subscriptions()
                    ->whereNull('exit_date')
                    ->count(),
                'subscribers' => $activity->subscriptions()
                    ->with('user:id,name,email')
                    ->get()
                    ->pluck('user'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiche attività recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle statistiche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search activities by name or description.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            
            if (empty($query)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parametro di ricerca mancante'
                ], 400);
            }

            $activities = Activity::where('name', 'LIKE', "%{$query}%")
                                ->orWhere('description', 'LIKE', "%{$query}%")
                                ->with(['year', 'subscriptions', 'payments'])
                                ->orderBy('start_date', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Ricerca completata con successo',
                'query' => $query
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella ricerca delle attività',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
