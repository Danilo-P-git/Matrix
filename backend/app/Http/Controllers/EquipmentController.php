<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;

class EquipmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Equipment::with(['year', 'subscription.user', 'event']);

        if ($request->filled('status') && Schema::hasColumn('equipment', 'status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('year_id') && Schema::hasColumn('equipment', 'year_id')) {
            $query->where('year_id', $request->year_id);
        }
        if ($request->filled('event_id') && Schema::hasColumn('equipment', 'event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                if (Schema::hasColumn('equipment', 'name')) {
                    $q->orWhere('name', 'like', "%{$search}%");
                }
                $q->orWhereHas('subscription.user', function ($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('event', function ($e) use ($search) {
                    $e->where('name', 'like', "%{$search}%");
                });
            });
        }

        $equipment = $query->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json($equipment);
    }

    public function store(StoreEquipmentRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $equipment = Equipment::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $equipment->load(['year', 'subscription', 'event']),
                'message' => 'Equipaggiamento creato con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella creazione dell\'equipaggiamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Equipment $equipment): JsonResponse
    {
        try {
            $equipment->load(['year', 'subscription.user', 'event']);

            return response()->json([
                'success' => true,
                'data' => $equipment,
                'message' => 'Equipaggiamento recuperato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dell\'equipaggiamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateEquipmentRequest $request, Equipment $equipment): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $equipment->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $equipment->fresh(['year', 'subscription', 'event']),
                'message' => 'Equipaggiamento aggiornato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'aggiornamento dell\'equipaggiamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Equipment $equipment): JsonResponse
    {
        try {
            $equipment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Equipaggiamento eliminato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione dell\'equipaggiamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByStatus($status): JsonResponse
    {
        try {
            $equipment = Equipment::where('status', $status)
                              ->with(['year', 'subscription.user', 'event'])
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $equipment,
                'message' => 'Equipaggiamenti per status recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero degli equipaggiamenti per status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function assign(Request $request, Equipment $equipment): JsonResponse
    {
        try {
            $request->validate([
                'subscription_id' => ['required', 'integer', 'exists:subscriptions,id'],
                'assign_date' => ['nullable', 'date']
            ]);

            $equipment->update([
                'subscription_id' => $request->subscription_id,
                'assign_date' => $request->assign_date ?? now(),
                'status' => 'assigned'
            ]);

            return response()->json([
                'success' => true,
                'data' => $equipment->fresh(['year', 'subscription.user', 'event']),
                'message' => 'Equipaggiamento assegnato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'assegnazione dell\'equipaggiamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
