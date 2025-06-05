<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGlycemiaRecordRequest extends FormRequest
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
            'value' => [
                'required',
                'numeric',
                'min:0.1',
                'max:30.0',
                'regex:/^\d+(\.\d{1})?$/' // Allow only one decimal place
            ],
            'measured_at' => [
                'required',
                'date',
                'before_or_equal:now',
                'after:' . now()->subYear()->toDateString() // Not older than 1 year
            ],
            'note' => [
                'nullable',
                'string',
                'max:1000'
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'value.required' => 'La valeur de glycémie est obligatoire.',
            'value.numeric' => 'La valeur doit être un nombre.',
            'value.min' => 'La valeur doit être supérieure à 0.',
            'value.max' => 'La valeur ne peut pas dépasser 30 mmol/L.',
            'value.regex' => 'La valeur ne peut avoir qu\'une seule décimale.',
            'measured_at.required' => 'La date et l\'heure sont obligatoires.',
            'measured_at.date' => 'Format de date invalide.',
            'measured_at.before_or_equal' => 'La date ne peut pas être dans le futur.',
            'measured_at.after' => 'La date ne peut pas être antérieure à un an.',
            'note.max' => 'La note ne peut pas dépasser 1000 caractères.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'value' => 'valeur de glycémie',
            'measured_at' => 'date et heure',
            'note' => 'note',
        ];
    }
}