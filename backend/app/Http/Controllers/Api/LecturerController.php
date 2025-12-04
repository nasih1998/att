<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LecturerController extends Controller
{
    public function index()
    {
        $lecturers = User::where('role', 'LECTURER')->orderBy('name')->get();
        return response()->json($lecturers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'LECTURER';

        $lecturer = User::create($validated);
        return response()->json($lecturer, 201);
    }

    public function show(User $lecturer)
    {
        if ($lecturer->role !== 'LECTURER') {
            return response()->json(['message' => 'Not a lecturer'], 404);
        }
        return response()->json($lecturer);
    }

    public function update(Request $request, User $lecturer)
    {
        if ($lecturer->role !== 'LECTURER') {
            return response()->json(['message' => 'Not a lecturer'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $lecturer->id,
            'password' => 'sometimes|string|min:8',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $lecturer->update($validated);
        return response()->json($lecturer);
    }

    public function destroy(User $lecturer)
    {
        if ($lecturer->role !== 'LECTURER') {
            return response()->json(['message' => 'Not a lecturer'], 404);
        }

        $lecturer->delete();
        return response()->json(['message' => 'Lecturer deleted successfully']);
    }
}
