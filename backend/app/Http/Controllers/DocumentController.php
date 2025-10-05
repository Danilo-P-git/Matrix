<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;

class DocumentController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $documents = Document::with(['user', 'activities', 'documentActivities.event'])
                              ->orderBy('created_at', 'desc')
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $documents,
                'message' => 'Documenti recuperati con successo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel recupero dei documenti',
                'error' => $e->getMessage()
            ], 500);
        }
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
