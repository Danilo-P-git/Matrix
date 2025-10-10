<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::with(['documentActivities.user', 'equipment', 'payments.user']);

        if ($request->filled('status') && Schema::hasColumn('events', 'status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('start_from') && Schema::hasColumn('events', 'start_time')) {
            $query->where('start_time', '>=', $request->start_from);
        }
        if ($request->filled('start_to') && Schema::hasColumn('events', 'start_time')) {
            $query->where('start_time', '<=', $request->start_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                if (Schema::hasColumn('events', 'name')) {
                    $q->orWhere('name', 'like', "%{$search}%");
                }
                if (Schema::hasColumn('events', 'location')) {
                    $q->orWhere('location', 'like', "%{$search}%");
                }
                $q->orWhereHas('payments.user', function ($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                });
            });
        }

        $events = $query->orderBy('start_time', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json($events);
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $event = Event::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $event->load(['documentActivities', 'equipment', 'payments']),
                'message' => 'Evento creato con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella creazione dell\'evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Event $event): JsonResponse
    {
        try {
            $event->load(['documentActivities.user', 'documentActivities.activity', 'equipment', 'payments.user']);

            return response()->json([
                'success' => true,
                'data' => $event,
                'message' => 'Evento recuperato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dell\'evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $event->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $event->fresh(['documentActivities', 'equipment', 'payments']),
                'message' => 'Evento aggiornato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'aggiornamento dell\'evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Event $event): JsonResponse
    {
        try {
            $paymentsCount = $event->payments()->count();
            $equipmentCount = $event->equipment()->count();

            if ($paymentsCount > 0 || $equipmentCount > 0) {
                $message = 'Impossibile eliminare l\'evento con ';
                $dependencies = [];

                if ($paymentsCount > 0) {
                    $dependencies[] = $paymentsCount . ' pagamenti associati';
                }

                if ($equipmentCount > 0) {
                    $dependencies[] = $equipmentCount . ' equipaggiamenti associati';
                }

                return response()->json([
                    'success' => false,
                    'message' => $message . implode(' e ', $dependencies) . '.',
                    'data' => [
                        'payments_count' => $paymentsCount,
                        'equipment_count' => $equipmentCount
                    ]
                ], 400);
            }

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Evento eliminato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione dell\'evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByStatus($status): JsonResponse
    {
        try {
            $events = Event::where('status', $status)
                          ->with(['documentActivities', 'equipment', 'payments'])
                          ->orderBy('start_time', 'desc')
                          ->get();

            return response()->json([
                'success' => true,
                'data' => $events,
                'message' => 'Eventi per status recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero degli eventi per status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function statistics(Event $event): JsonResponse
    {
        try {
            $stats = [
                'event_info' => [
                    'id' => $event->id,
                    'name' => $event->name,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'cost' => $event->cost,
                    'status' => $event->status,
                ],
                'participants_count' => $event->documentActivities()->count(),
                'equipment_count' => $event->equipment()->count(),
                'payments_count' => $event->payments()->count(),
                'total_revenue' => $event->payments()->sum('amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiche evento recuperate con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero delle statistiche',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
