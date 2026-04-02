<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DoctorsRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:45'],
            'specialization_id' => ['required', 'integer', 'exists:specializations,id'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The :attribute field is required.',
            'name.max' => 'The :attribute may not be greater than :max characters.',
            'lastname.required' => 'The :attribute field is required.',
            'lastname.max' => 'The :attribute may not be greater than :max characters.',
            'specialization_id.required' => 'Please choose a specialization.',
            'specialization_id.exists' => 'Selected specialization does not exist.',
            'department_id.required' => 'Please choose a department.',
            'department_id.exists' => 'Selected department does not exist.',
        ];
    }
}
