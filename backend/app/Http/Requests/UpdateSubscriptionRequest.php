<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'activity_id' => ['sometimes', 'required', 'integer', 'exists:activities,id'],
            'exit_date' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'L\'utente è obbligatorio.',
            'user_id.exists' => 'L\'utente selezionato non esiste.',
            'activity_id.required' => 'L\'attività è obbligatoria.',
            'activity_id.exists' => 'L\'attività selezionata non esiste.',
        ];
    }
}