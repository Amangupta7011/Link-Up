<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            // Exactly one of the following must be set: receiver_id or group_id
            $table->foreignId('receiver_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('group_id')->nullable()->constrained('groups')->onDelete('cascade');

            $table->text('body')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->foreignId('reply_to_id')->nullable()->constrained('messages')->onDelete('set null');
            $table->foreignId('forwarded_from_id')->nullable()->constrained('messages')->onDelete('set null');

            // For one-to-one messages status, could track in pivot for groups, but for simplicity:
            $table->boolean('is_delivered')->default(false);
            $table->boolean('is_seen')->default(false);

            $table->timestamps();
        });

        // For tracking read/delivered status in group messages
        Schema::create('message_user_status', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_delivered')->default(false);
            $table->boolean('is_seen')->default(false);
            $table->timestamps();

            $table->unique(['message_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_user_status');
        Schema::dropIfExists('messages');
    }
};
