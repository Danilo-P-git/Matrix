<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check if user is already subscribed to this activity
            if ($this->user_id && $this->activity_id) {
                $exists = \App\Models\Subscription::where('user_id', $this->user_id)
                    ->where('activity_id', $this->activity_id)
                    ->whereNull('exit_date')
                    ->exists();
                    
                if ($exists) {
                    $validator->errors()->add('user_id', 'L\'utente è già iscritto a questa attività.');
                }
            }
        });
    }
}