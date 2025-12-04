<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceSheet extends Model
{
    use HasFactory;

    protected $fillable = [
        'lecture_id',
        'lecturer_id',
        'week_label',
        'sheet_label',
    ];

    /**
     * Get the lecture that owns the attendance sheet.
     */
    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }

    /**
     * Get the lecturer that owns the attendance sheet.
     */
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    /**
     * Get the attendance records for the sheet.
     */
    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}
