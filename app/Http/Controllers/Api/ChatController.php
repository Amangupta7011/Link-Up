<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use App\Events\UserTyping;

class ChatController extends Controller
{
    public function users(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)->get();
        return response()->json(['users' => $users]);
    }

    public function fetchMessages(Request $request, $user_id)
    {
        $limit = $request->query('limit', 50);
        $offset = $request->query('offset', 0);

        $messages = Message::with(['sender', 'receiver', 'attachments'])
            ->where(function ($query) use ($request, $user_id) {
                $query->where('sender_id', $request->user()->id)
                    ->where('receiver_id', $user_id);
            })
            ->orWhere(function ($query) use ($request, $user_id) {
                $query->where('sender_id', $user_id)
                    ->where('receiver_id', $request->user()->id);
            })
            ->orderBy('created_at', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();

        return response()->json(['messages' => $messages]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required_without:group_id|exists:users,id',
            'group_id' => 'required_without:receiver_id|exists:groups,id',
            'body' => 'nullable|string',
            'attachments.*' => 'nullable|file|max:10240'
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'group_id' => $request->group_id,
            'body' => $request->body,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $message->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => '/storage/' . $path,
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        $message->load(['sender', 'attachments']);

        broadcast(new MessageSent($message));

        return response()->json(['message' => $message]);
    }

    public function markAsRead(Request $request, Message $message)
    {
        if ($message->receiver_id === $request->user()->id) {
            $message->update(['is_seen' => true]);
        }
        return response()->json(['success' => true]);
    }

    public function deleteMessage(Request $request, Message $message)
    {
        if ($message->sender_id === $request->user()->id) {
            $message->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
