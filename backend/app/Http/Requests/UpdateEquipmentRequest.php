<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:65535'],
            'quantity' => ['integer', 'min:1'],
            'code' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'max:100'],
            'year_id' => ['sometimes', 'required', 'integer', 'exists:years,id'],
            'subscription_id' => ['nullable', 'integer', 'exists:subscriptions,id'],
            'assign_date' => ['nullable', 'date'],
            'return_date' => ['nullable', 'date', 'after_or_equal:assign_date'],
            'status' => ['in:available,assigned,under_maintenance'],
            'is_available_for_sale' => ['nullable', 'boolean'],
            'condition' => ['in:nuova,usata,danneggiata,rotta'],
            'size' => ['nullable', 'string', 'max:50'],
            'note' => ['nullable', 'string', 'max:65535'],
            'event_id' => ['nullable', 'integer', 'exists:events,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Il nome dell\'equipaggiamento è obbligatorio.',
            'year_id.required' => 'L\'anno è obbligatorio.',
            'year_id.exists' => 'L\'anno selezionato non esiste.',
            'quantity.min' => 'La quantità deve essere almeno 1.',
        ];
    }
}