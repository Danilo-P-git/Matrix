<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Document::with(['user', 'activities', 'documentActivities.event']);

        if ($request->filled('user_id') && Schema::hasColumn('documents', 'user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('type') && Schema::hasColumn('documents', 'type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                if (Schema::hasColumn('documents', 'name')) {
                    $q->orWhere('name', 'like', "%{$search}%");
                }
                if (Schema::hasColumn('documents', 'description')) {
                    $q->orWhere('description', 'like', "%{$search}%");
                }
                $q->orWhereHas('user', function ($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('activities', function ($a) use ($search) {
                    $a->where('name', 'like', "%{$search}%");
                });
            });
        }

        $documents = $query->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json($documents);
    }

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $document = Document::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $document->load(['user', 'activities']),
                'message' => 'Documento creato con successo'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nella creazione del documento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Document $document): JsonResponse
    {
        try {
            $document->load(['user', 'activities', 'documentActivities.event', 'documentActivities.user']);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Documento recuperato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero del documento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateDocumentRequest $request, Document $document): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $document->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $document->fresh(['user', 'activities']),
                'message' => 'Documento aggiornato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nell\'aggiornamento del documento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Document $document): JsonResponse
    {
        try {
            $activitiesCount = $document->activities()->count();

            if ($activitiesCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Impossibile eliminare il documento con {$activitiesCount} attività associate.",
                    'data' => ['activities_count' => $activitiesCount]
                ], 400);
            }

            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Documento eliminato con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'eliminazione del documento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByUser($userId): JsonResponse
    {
        try {
            $documents = Document::where('user_id', $userId)
                              ->with(['activities', 'documentActivities.event'])
                              ->orderBy('created_at', 'desc')
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $documents,
                'message' => 'Documenti utente recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dei documenti utente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
