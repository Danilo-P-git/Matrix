<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'event_id' => 'required|exists:events,id',
            'note' => 'nullable|string|max:1000',
            'status' => 'required|in:presente,assente',
            'exit_date' => 'nullable|date',
            'is_outsider' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'L\'utente è obbligatorio',
            'user_id.exists' => 'L\'utente selezionato non esiste',
            'event_id.required' => 'L\'evento è obbligatorio',
            'event_id.exists' => 'L\'evento selezionato non esiste',
            'note.max' => 'La nota non può superare i 1000 caratteri',
            'status.required' => 'Lo stato è obbligatorio',
            'status.in' => 'Lo stato deve essere presente o assente',
            'exit_date.date' => 'La data di uscita deve essere una data valida',
            'is_outsider.boolean' => 'Il campo esterno deve essere vero o falso',
        ];
    }
}
