<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSheet;
use App\Models\Lecture;
use Illuminate\Http\Request;

class AttendanceSheetController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lecture_id' => 'required|exists:lectures,id',
            'week_label' => 'required|string',
        ]);

        $lecture = Lecture::findOrFail($validated['lecture_id']);
        
        // Count existing sheets for this lecture and week
        $sheetCount = AttendanceSheet::where('lecture_id', $validated['lecture_id'])
            ->where('week_label', $validated['week_label'])
            ->count();

        $sheetLabel = 'Sheet ' . ($sheetCount + 1);

        $sheet = AttendanceSheet::create([
            'lecture_id' => $validated['lecture_id'],
            'lecturer_id' => $lecture->lecturer_id,
            'week_label' => $validated['week_label'],
            'sheet_label' => $sheetLabel,
        ]);

        $sheet->load('lecture', 'lecturer');
        return response()->json($sheet, 201);
    }

    public function index(Request $request)
    {
        $query = AttendanceSheet::with('lecture', 'lecturer');

        if ($request->has('lecture_id')) {
            $query->where('lecture_id', $request->lecture_id);
        }

        $sheets = $query->orderBy('week_label')->orderBy('sheet_label')->get();
        return response()->json($sheets);
    }
}
