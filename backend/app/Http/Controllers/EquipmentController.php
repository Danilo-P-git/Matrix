<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;

class EquipmentController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $equipment = Equipment::with(['year', 'subscription.user', 'event'])
                              ->orderBy('created_at', 'desc')
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $equipment,
                'message' => 'Equipaggiamenti recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero degli equipaggiamenti',
                'error' => $e->getMessage()
            ], 500);
        }
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
