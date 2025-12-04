<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\AttendanceSheet;
use App\Models\Student;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Get attendance records for a specific sheet with all students
     */
    public function getRecords($sheetId)
    {
        $sheet = AttendanceSheet::with('lecture')->findOrFail($sheetId);
        $students = Student::where('active', true)->orderBy('full_name')->get();
        
        $records = AttendanceRecord::where('attendance_sheet_id', $sheetId)
            ->with('student')
            ->get()
            ->keyBy('student_id');

        // Build response with all students and their attendance status
        $attendanceData = $students->map(function ($student) use ($records) {
            $record = $records->get($student->id);
            return [
                'student' => $student,
                'status' => $record ? $record->status : null,
                'record_id' => $record ? $record->id : null,
            ];
        });

        return response()->json([
            'sheet' => $sheet,
            'attendance' => $attendanceData,
        ]);
    }

    /**
     * Save or update attendance records
     */
    public function saveRecords(Request $request, $sheetId)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|in:IN_CLASS,NOT_IN_CLASS',
        ]);

        $sheet = AttendanceSheet::findOrFail($sheetId);

        foreach ($validated['records'] as $recordData) {
            AttendanceRecord::updateOrCreate(
                [
                    'attendance_sheet_id' => $sheetId,
                    'student_id' => $recordData['student_id'],
                ],
                [
                    'status' => $recordData['status'],
                ]
            );
        }

        return response()->json(['message' => 'Attendance saved successfully']);
    }

    /**
     * Get sheets for a specific lecture
     */
    public function getSheets($lectureId)
    {
        $sheets = AttendanceSheet::where('lecture_id', $lectureId)
            ->orderBy('week_label')
            ->orderBy('sheet_label')
            ->get();

        return response()->json($sheets);
    }
}
