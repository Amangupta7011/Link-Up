<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\GroupController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Profile
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);

    // Chat
    Route::get('/users', [ChatController::class, 'users']);
    Route::get('/messages/{user_id}', [ChatController::class, 'fetchMessages']);
    Route::post('/messages', [ChatController::class, 'sendMessage']);
    Route::post('/messages/{message}/read', [ChatController::class, 'markAsRead']);
    Route::delete('/messages/{message}', [ChatController::class, 'deleteMessage']);

    // Groups
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups', [GroupController::class, 'index']);
    Route::get('/groups/{group}', [GroupController::class, 'show']);
    Route::post('/groups/{group}/members', [GroupController::class, 'addMember']);
});
