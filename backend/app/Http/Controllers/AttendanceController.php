<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::with(['user', 'event']);

        // Filtro per evento
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        // Filtro per utente
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filtro per status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtro per outsider
        if ($request->has('is_outsider')) {
            $query->where('is_outsider', $request->boolean('is_outsider'));
        }

        // Ricerca
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('event', function ($eventQuery) use ($search) {
                      $eventQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $attendances = $query->paginate($request->get('per_page', 15));

        return response()->json($attendances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $attendance = Attendance::create($request->validated());
        $attendance->load(['user', 'event']);

        return response()->json([
            'message' => 'Presenza creata con successo',
            'data' => $attendance
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance): JsonResponse
    {
        $attendance->load(['user', 'event']);
        
        return response()->json($attendance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance): JsonResponse
    {
        $attendance->update($request->validated());
        $attendance->load(['user', 'event']);

        return response()->json([
            'message' => 'Presenza aggiornata con successo',
            'data' => $attendance
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json([
            'message' => 'Presenza eliminata con successo'
        ]);
    }

    /**
     * Restore a soft deleted attendance.
     */
    public function restore($id): JsonResponse
    {
        $attendance = Attendance::withTrashed()->findOrFail($id);
        $attendance->restore();
        $attendance->load(['user', 'event']);

        return response()->json([
            'message' => 'Presenza ripristinata con successo',
            'data' => $attendance
        ]);
    }

    /**
     * Get attendances by event.
     */
    public function getByEvent($eventId): JsonResponse
    {
        $attendances = Attendance::with(['user', 'event'])
            ->where('event_id', $eventId)
            ->get();

        return response()->json($attendances);
    }

    /**
     * Get attendances by user.
     */
    public function getByUser($userId): JsonResponse
    {
        $attendances = Attendance::with(['user', 'event'])
            ->where('user_id', $userId)
            ->get();

        return response()->json($attendances);
    }

    /**
     * Get attendances by status.
     */
    public function getByStatus($status): JsonResponse
    {
        $attendances = Attendance::with(['user', 'event'])
            ->where('status', $status)
            ->get();

        return response()->json($attendances);
    }

    /**
     * Mark attendance as present.
     */
    public function markAsPresent(Attendance $attendance): JsonResponse
    {
        $attendance->update(['status' => 'presente']);
        $attendance->load(['user', 'event']);

        return response()->json([
            'message' => 'Presenza contrassegnata come presente',
            'data' => $attendance
        ]);
    }

    /**
     * Mark attendance as absent.
     */
    public function markAsAbsent(Attendance $attendance): JsonResponse
    {
        $attendance->update(['status' => 'assente']);
        $attendance->load(['user', 'event']);

        return response()->json([
            'message' => 'Presenza contrassegnata come assente',
            'data' => $attendance
        ]);
    }

    /**
     * Set exit date for attendance.
     */
    public function setExitDate(Request $request, Attendance $attendance): JsonResponse
    {
        $request->validate([
            'exit_date' => 'required|date'
        ]);

        $attendance->update(['exit_date' => $request->exit_date]);
        $attendance->load(['user', 'event']);

        return response()->json([
            'message' => 'Data di uscita impostata con successo',
            'data' => $attendance
        ]);
    }

    /**
     * Get attendance statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Attendance::count(),
            'present' => Attendance::where('status', 'presente')->count(),
            'absent' => Attendance::where('status', 'assente')->count(),
            'outsiders' => Attendance::where('is_outsider', true)->count(),
            'with_exit_date' => Attendance::whereNotNull('exit_date')->count(),
        ];

        return response()->json($stats);
    }
}
