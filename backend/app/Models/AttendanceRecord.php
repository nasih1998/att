<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'attendance_sheet_id',
        'student_id',
        'status',
    ];

    /**
     * Get the attendance sheet that owns the record.
     */
    public function attendanceSheet()
    {
        return $this->belongsTo(AttendanceSheet::class);
    }

    /**
     * Get the student that owns the record.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
