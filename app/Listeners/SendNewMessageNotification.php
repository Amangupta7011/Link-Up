<?php

namespace App\Listeners;

use App\Events\MessageSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendNewMessageNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct()
    {
        //
    }

    public function handle(MessageSent $event): void
    {
        // Logic to send push notifications, emails, or FCM
        // We log it as an example for the listener.
        $message = $event->message;
        Log::info("Push Notification sent for message ID: {$message->id}");
    }
}
