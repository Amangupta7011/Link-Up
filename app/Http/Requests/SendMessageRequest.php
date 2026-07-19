<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receiver_id' => 'required_without:group_id|exists:users,id',
            'group_id' => 'required_without:receiver_id|exists:groups,id',
            'body' => 'nullable|string:max:10000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|max:10240' // 10MB per file max
        ];
    }
}
