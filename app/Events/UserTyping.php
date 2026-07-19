<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserTyping implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $senderId;
    public $receiverId;
    public $groupId;

    public function __construct($senderId, $receiverId = null, $groupId = null)
    {
        $this->senderId = $senderId;
        $this->receiverId = $receiverId;
        $this->groupId = $groupId;
    }

    public function broadcastOn(): array
    {
        if ($this->groupId) {
            return [
                new PrivateChannel('group.' . $this->groupId),
            ];
        }

        return [
            new PrivateChannel('chat.' . $this->receiverId),
        ];
    }
}
