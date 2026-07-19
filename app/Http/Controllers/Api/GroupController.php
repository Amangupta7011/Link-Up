<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $groups = $request->user()->groups()->with('admin')->get();
        return response()->json(['groups' => $groups]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $group = Group::create([
            'name' => $request->name,
            'admin_id' => $request->user()->id
        ]);

        $userIds = $request->user_ids ?? [];
        $userIds[] = $request->user()->id; // Add self

        $group->members()->attach(array_unique($userIds));

        return response()->json(['group' => $group->load('members')]);
    }

    public function show(Group $group)
    {
        $group->load(['members', 'admin']);
        return response()->json(['group' => $group]);
    }

    public function addMember(Request $request, Group $group)
    {
        if ($group->admin_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        if (!$group->members()->where('user_id', $request->user_id)->exists()) {
            $group->members()->attach($request->user_id);
        }

        return response()->json(['success' => true]);
    }
}
