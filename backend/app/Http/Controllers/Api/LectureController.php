<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lecture;
use Illuminate\Http\Request;

class LectureController extends Controller
{
    public function index()
    {
        $lectures = Lecture::with('lecturer')->orderBy('name')->get();
        return response()->json($lectures);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:lectures,code',
            'type' => 'required|in:THEORY,PRACTICAL',
            'lecturer_id' => 'required|exists:users,id',
        ]);

        $lecture = Lecture::create($validated);
        $lecture->load('lecturer');
        return response()->json($lecture, 201);
    }

    public function show(Lecture $lecture)
    {
        $lecture->load('lecturer');
        return response()->json($lecture);
    }

    public function update(Request $request, Lecture $lecture)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:lectures,code,' . $lecture->id,
            'type' => 'sometimes|in:THEORY,PRACTICAL',
            'lecturer_id' => 'sometimes|exists:users,id',
        ]);

        $lecture->update($validated);
        $lecture->load('lecturer');
        return response()->json($lecture);
    }

    public function destroy(Lecture $lecture)
    {
        $lecture->delete();
        return response()->json(['message' => 'Lecture deleted successfully']);
    }

    public function myLectures(Request $request)
    {
        $lectures = Lecture::where('lecturer_id', $request->user()->id)
            ->with('lecturer')
            ->orderBy('name')
            ->get();
        return response()->json($lectures);
    }
}
