<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RestoreYearRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Add authorization logic if needed (e.g., check user permissions)
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
            // No specific validation needed for restore operation
            // The year ID is validated through route model binding
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $yearId = $this->route('id');
            
            // Check if the year exists in soft deleted records
            if (!\App\Models\Year::withTrashed()->where('id', $yearId)->exists()) {
                $validator->errors()->add('year', 'L\'anno specificato non esiste.');
            }
            
            // Check if the year is actually soft deleted
            if (\App\Models\Year::where('id', $yearId)->exists()) {
                $validator->errors()->add('year', 'L\'anno specificato non è stato eliminato e non può essere ripristinato.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'year.exists' => 'L\'anno specificato non esiste.',
        ];
    }
}