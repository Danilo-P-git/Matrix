<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['user', 'activity', 'event']);

        if ($request->filled('status') && Schema::hasColumn('payments', 'status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('user_id') && Schema::hasColumn('payments', 'user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('activity_id') && Schema::hasColumn('payments', 'activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }
        if ($request->filled('event_id') && Schema::hasColumn('payments', 'event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                if (Schema::hasColumn('payments', 'notes')) {
                    $q->orWhere('notes', 'like', "%{$search}%");
                }
                $q->orWhereHas('user', function ($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('activity', function ($a) use ($search) {
                    $a->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('event', function ($e) use ($search) {
                    $e->where('name', 'like', "%{$search}%");
                });
            });
        }

        $payments = $query->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json($payments);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $payment = Payment::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $payment->load(['user', 'activity', 'event']),
                'message' => 'Pagamento creato con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella creazione del pagamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Payment $payment): JsonResponse
    {
        try {
            $payment->load(['user', 'activity', 'event']);

            return response()->json([
                'success' => true,
                'data' => $payment,
                'message' => 'Pagamento recuperato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero del pagamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $payment->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $payment->fresh(['user', 'activity', 'event']),
                'message' => 'Pagamento aggiornato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'aggiornamento del pagamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Payment $payment): JsonResponse
    {
        try {
            $payment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pagamento eliminato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione del pagamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByUser($userId): JsonResponse
    {
        try {
            $payments = Payment::where('user_id', $userId)
                             ->with(['activity', 'event'])
                             ->orderBy('created_at', 'desc')
                             ->get();

            return response()->json([
                'success' => true,
                'data' => $payments,
                'message' => 'Pagamenti utente recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dei pagamenti utente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByStatus($status): JsonResponse
    {
        try {
            $payments = Payment::where('status', $status)
                             ->with(['user', 'activity', 'event'])
                             ->orderBy('created_at', 'desc')
                             ->get();

            return response()->json([
                'success' => true,
                'data' => $payments,
                'message' => 'Pagamenti per status recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dei pagamenti per status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function markAsPaid(Payment $payment): JsonResponse
    {
        try {
            $payment->update(['status' => 'completato']);

            return response()->json([
                'success' => true,
                'data' => $payment->fresh(['user', 'activity', 'event']),
                'message' => 'Pagamento segnato come completato'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella modifica dello status del pagamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
