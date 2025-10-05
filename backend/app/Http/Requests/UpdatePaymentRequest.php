<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'activity_id' => ['nullable', 'integer', 'exists:activities,id'],
            'event_id' => ['nullable', 'integer', 'exists:events,id'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:999999.99'],
            'description' => ['nullable', 'string', 'max:65535'],
            'type_of_payment' => ['in:contanti,carta,bonifico,e-pay'],
            'status' => ['in:da pagare,completato,annullato'],
            'is_partial' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'L\'utente è obbligatorio.',
            'user_id.exists' => 'L\'utente selezionato non esiste.',
            'amount.required' => 'L\'importo è obbligatorio.',
            'amount.min' => 'L\'importo non può essere negativo.',
        ];
    }
}