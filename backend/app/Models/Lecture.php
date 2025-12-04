<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'lecturer_id',
    ];

    /**
     * Get the lecturer that owns the lecture.
     */
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    /**
     * Get the attendance sheets for the lecture.
     */
    public function attendanceSheets()
    {
        return $this->hasMany(AttendanceSheet::class);
    }
}
