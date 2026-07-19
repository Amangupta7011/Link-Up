<?php

namespace App\Services;

use App\Models\Message;
use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Events\MessageSent;

class ChatService
{
    /**
     * Send a new message from one user to another or a group.
     */
    public function sendMessage($senderId, array $data, $attachments)
    {
        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $data['receiver_id'] ?? null,
            'group_id' => $data['group_id'] ?? null,
            'body' => $data['body'] ?? null,
            'reply_to_id' => $data['reply_to_id'] ?? null,
        ]);

        if ($attachments) {
            foreach ($attachments as $file) {
                if ($file instanceof UploadedFile) {
                    $path = $file->store('attachments', 'public');
                    $message->attachments()->create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => '/storage/' . $path,
                        'file_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }
        }

        $message->load(['sender', 'attachments', 'replyTo']);

        broadcast(new MessageSent($message))->toOthers();

        return $message;
    }
}
