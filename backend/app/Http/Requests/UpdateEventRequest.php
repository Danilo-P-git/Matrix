<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'location' => ['nullable', 'string', 'max:255'],
            'start_time' => ['nullable', 'date'],
            'end_time' => ['nullable', 'date', 'after_or_equal:start_time'],
            'status' => ['in:Programmato,In corso,Completato'],
            'is_full' => ['boolean'],
            'cost' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Il nome dell\'evento è obbligatorio.',
            'end_time.after_or_equal' => 'L\'ora di fine deve essere successiva all\'ora di inizio.',
            'cost.min' => 'Il costo non può essere negativo.',
        ];
    }
}