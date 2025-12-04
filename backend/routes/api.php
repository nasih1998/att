<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AttendanceSheetController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LectureController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin only routes
    Route::middleware('role:ADMIN')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('lecturers', LecturerController::class);
        Route::apiResource('lectures', LectureController::class);
        Route::post('attendance-sheets', [AttendanceSheetController::class, 'store']);
    });

    // Admin and Lecturer routes
    Route::middleware('role:ADMIN,LECTURER')->group(function () {
        Route::get('my-lectures', [LectureController::class, 'myLectures']);
        Route::get('attendance-sheets', [AttendanceSheetController::class, 'index']);
        Route::get('lectures/{lectureId}/sheets', [AttendanceController::class, 'getSheets']);
        Route::get('attendance-sheets/{sheetId}/records', [AttendanceController::class, 'getRecords']);
        Route::post('attendance-sheets/{sheetId}/records', [AttendanceController::class, 'saveRecords']);
    });
});
