<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:65535'],
            'note' => ['nullable', 'string', 'max:65535'],
            'path' => ['nullable', 'string', 'max:500'],
            'type' => ['nullable', 'string', 'max:100'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Il nome del documento è obbligatorio.',
            'name.max' => 'Il nome non può superare i 255 caratteri.',
            'user_id.required' => 'L\'utente è obbligatorio.',
            'user_id.exists' => 'L\'utente selezionato non esiste.',
        ];
    }
}