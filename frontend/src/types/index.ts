export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'LECTURER';
}

export interface Student {
    id: number;
    full_name: string;
    email: string;
    student_number: string;
    active: boolean;
}

export interface Lecture {
    id: number;
    name: string;
    code: string;
    type: 'THEORY' | 'PRACTICAL';
    lecturer_id: number;
    lecturer?: User;
}

export interface AttendanceSheet {
    id: number;
    lecture_id: number;
    lecturer_id: number;
    week_label: string;
    sheet_label: string;
    lecture?: Lecture;
    lecturer?: User;
}

export interface AttendanceRecord {
    id?: number;
    attendance_sheet_id: number;
    student_id: number;
    status: 'IN_CLASS' | 'NOT_IN_CLASS';
    student?: Student;
}

export interface AttendanceData {
    student: Student;
    status: 'IN_CLASS' | 'NOT_IN_CLASS' | null;
    record_id: number | null;
}

export interface LoginResponse {
    user: User;
    token: string;
}
