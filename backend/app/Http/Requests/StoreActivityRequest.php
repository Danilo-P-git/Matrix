<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'description' => [
                'nullable',
                'string',
                'max:65535'
            ],
            'start_date' => [
                'nullable',
                'date',
                'before_or_equal:end_date'
            ],
            'end_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date'
            ],
            'note' => [
                'nullable',
                'string',
                'max:65535'
            ],
            'year_id' => [
                'required',
                'integer',
                'exists:years,id'
            ],
            'cost' => [
                'nullable',
                'numeric',
                'min:0',
                'max:999999.99'
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Il nome dell\'attività è obbligatorio.',
            'name.string' => 'Il nome dell\'attività deve essere una stringa.',
            'name.max' => 'Il nome dell\'attività non può superare i 255 caratteri.',
            'description.string' => 'La descrizione deve essere una stringa.',
            'description.max' => 'La descrizione non può superare i 65535 caratteri.',
            'start_date.date' => 'La data di inizio deve essere una data valida.',
            'start_date.before_or_equal' => 'La data di inizio deve essere precedente o uguale alla data di fine.',
            'end_date.date' => 'La data di fine deve essere una data valida.',
            'end_date.after_or_equal' => 'La data di fine deve essere successiva o uguale alla data di inizio.',
            'note.string' => 'Le note devono essere una stringa.',
            'note.max' => 'Le note non possono superare i 65535 caratteri.',
            'year_id.required' => 'L\'anno di riferimento è obbligatorio.',
            'year_id.integer' => 'L\'anno di riferimento deve essere un numero intero.',
            'year_id.exists' => 'L\'anno di riferimento selezionato non esiste.',
            'cost.numeric' => 'Il costo deve essere un numero.',
            'cost.min' => 'Il costo non può essere negativo.',
            'cost.max' => 'Il costo non può superare 999999.99.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nome',
            'description' => 'descrizione',
            'start_date' => 'data di inizio',
            'end_date' => 'data di fine',
            'note' => 'note',
            'year_id' => 'anno',
            'cost' => 'costo',
        ];
    }
}