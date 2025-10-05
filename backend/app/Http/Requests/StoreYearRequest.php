<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreYearRequest extends FormRequest
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
                'max:255',
                'unique:years,name'
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
            'description' => [
                'nullable',
                'string',
                'max:65535'
            ],
            'note' => [
                'nullable',
                'string',
                'max:65535'
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
            'name.required' => 'Il nome dell\'anno è obbligatorio.',
            'name.string' => 'Il nome dell\'anno deve essere una stringa.',
            'name.max' => 'Il nome dell\'anno non può superare i 255 caratteri.',
            'name.unique' => 'Esiste già un anno con questo nome.',
            'start_date.date' => 'La data di inizio deve essere una data valida.',
            'start_date.before_or_equal' => 'La data di inizio deve essere precedente o uguale alla data di fine.',
            'end_date.date' => 'La data di fine deve essere una data valida.',
            'end_date.after_or_equal' => 'La data di fine deve essere successiva o uguale alla data di inizio.',
            'description.string' => 'La descrizione deve essere una stringa.',
            'description.max' => 'La descrizione non può superare i 65535 caratteri.',
            'note.string' => 'Le note devono essere una stringa.',
            'note.max' => 'Le note non possono superare i 65535 caratteri.',
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
            'start_date' => 'data di inizio',
            'end_date' => 'data di fine',
            'description' => 'descrizione',
            'note' => 'note',
        ];
    }
}