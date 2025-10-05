<?php

namespace App\Http\Controllers;

use App\Models\Year;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\StoreYearRequest;
use App\Http\Requests\UpdateYearRequest;
use App\Http\Requests\RestoreYearRequest;

class YearController extends Controller
{
    /**
     * Display a listing of the years.
     */
    public function index(): JsonResponse
    {
        try {
            $years = Year::with(['activities', 'equipment'])
                        ->orderBy('start_date', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $years,
                'message' => 'Anni recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving years',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created year in storage.
     */
    public function store(StoreYearRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $year = Year::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $year->load(['activities', 'equipment']),
                'message' => 'Anno creato con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating year',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified year.
     */
    public function show(Year $year): JsonResponse
    {
        try {
            $year->load(['activities', 'equipment']);

            return response()->json([
                'success' => true,
                'data' => $year,
                'message' => 'Anno recuperato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving year',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified year in storage.
     */
    public function update(UpdateYearRequest $request, Year $year): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $year->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $year->fresh(['activities', 'equipment']),
                'message' => 'Anno aggiornato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating year',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified year from storage (soft delete).
     */
    public function destroy(Year $year): JsonResponse
    {
        try {
            // Check if year has associated activities or equipment
            $activitiesCount = $year->activities()->count();
            $equipmentCount = $year->equipment()->count();
            
            if ($activitiesCount > 0 || $equipmentCount > 0) {
                $message = 'Impossibile eliminare l\'anno con ';
                $dependencies = [];
                
                if ($activitiesCount > 0) {
                    $dependencies[] = $activitiesCount . ' attività associate';
                }
                
                if ($equipmentCount > 0) {
                    $dependencies[] = $equipmentCount . ' equipaggiamenti associati';
                }
                
                return response()->json([
                    'success' => false,
                    'message' => $message . implode(' e ', $dependencies) . '.',
                    'data' => [
                        'activities_count' => $activitiesCount,
                        'equipment_count' => $equipmentCount
                    ]
                ], 400);
            }

            $year->delete();

            return response()->json([
                'success' => true,
                'message' => 'Anno eliminato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione dell\'anno',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a soft deleted year.
     */
    public function restore(RestoreYearRequest $request, $id): JsonResponse
    {
        try {
            $year = Year::withTrashed()->findOrFail($id);
            $year->restore();

            return response()->json([
                'success' => true,
                'data' => $year->fresh(['activities', 'equipment']),
                'message' => 'Anno ripristinato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error restoring year',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Force delete a year (permanent deletion).
     */
    public function forceDelete($id): JsonResponse
    {
        try {
            $year = Year::withTrashed()->findOrFail($id);
            $year->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Year permanently deleted'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error permanently deleting year',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all years including soft deleted ones.
     */
    public function indexWithTrashed(): JsonResponse
    {
        try {
            $years = Year::withTrashed()
                        ->with(['activities', 'equipment'])
                        ->orderBy('start_date', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $years,
                'message' => 'Years with trashed retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving years with trashed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get only soft deleted years.
     */
    public function onlyTrashed(): JsonResponse
    {
        try {
            $years = Year::onlyTrashed()
                        ->with(['activities', 'equipment'])
                        ->orderBy('deleted_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $years,
                'message' => 'Trashed years retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving trashed years',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics about a specific year.
     */
    public function statistics(Year $year): JsonResponse
    {
        try {
            $stats = [
                'year_info' => [
                    'id' => $year->id,
                    'name' => $year->name,
                    'start_date' => $year->start_date,
                    'end_date' => $year->end_date,
                ],
                'activities_count' => $year->activities()->count(),
                'equipment_count' => $year->equipment()->count(),
                'activities' => $year->activities()->select('id', 'name', 'start_date', 'end_date')->get(),
                'equipment_by_status' => $year->equipment()
                    ->selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get()
                    ->pluck('count', 'status'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Year statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving year statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
