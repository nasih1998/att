import api from './axios';
import type { Student, User, Lecture, AttendanceSheet, AttendanceData } from '../types';

export const adminApi = {
    // Students
    getStudents: async (): Promise<Student[]> => {
        const response = await api.get<Student[]>('/students');
        return response.data;
    },

    createStudent: async (data: Omit<Student, 'id'>): Promise<Student> => {
        const response = await api.post<Student>('/students', data);
        return response.data;
    },

    updateStudent: async (id: number, data: Partial<Student>): Promise<Student> => {
        const response = await api.put<Student>(`/students/${id}`, data);
        return response.data;
    },

    deleteStudent: async (id: number): Promise<void> => {
        await api.delete(`/students/${id}`);
    },

    // Lecturers
    getLecturers: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/lecturers');
        return response.data;
    },

    createLecturer: async (data: { name: string; email: string; password: string }): Promise<User> => {
        const response = await api.post<User>('/lecturers', data);
        return response.data;
    },

    updateLecturer: async (id: number, data: Partial<User>): Promise<User> => {
        const response = await api.put<User>(`/lecturers/${id}`, data);
        return response.data;
    },

    deleteLecturer: async (id: number): Promise<void> => {
        await api.delete(`/lecturers/${id}`);
    },

    // Lectures
    getLectures: async (): Promise<Lecture[]> => {
        const response = await api.get<Lecture[]>('/lectures');
        return response.data;
    },

    createLecture: async (data: Omit<Lecture, 'id' | 'lecturer'>): Promise<Lecture> => {
        const response = await api.post<Lecture>('/lectures', data);
        return response.data;
    },

    updateLecture: async (id: number, data: Partial<Lecture>): Promise<Lecture> => {
        const response = await api.put<Lecture>(`/lectures/${id}`, data);
        return response.data;
    },

    deleteLecture: async (id: number): Promise<void> => {
        await api.delete(`/lectures/${id}`);
    },

    // Attendance Sheets
    createAttendanceSheet: async (data: { lecture_id: number; week_label: string }): Promise<AttendanceSheet> => {
        const response = await api.post<AttendanceSheet>('/attendance-sheets', data);
        return response.data;
    },

    getAttendanceSheets: async (lectureId?: number): Promise<AttendanceSheet[]> => {
        const params = lectureId ? { lecture_id: lectureId } : {};
        const response = await api.get<AttendanceSheet[]>('/attendance-sheets', { params });
        return response.data;
    },
};

export const attendanceApi = {
    getSheets: async (lectureId: number): Promise<AttendanceSheet[]> => {
        const response = await api.get<AttendanceSheet[]>(`/lectures/${lectureId}/sheets`);
        return response.data;
    },

    getRecords: async (sheetId: number): Promise<{ sheet: AttendanceSheet; attendance: AttendanceData[] }> => {
        const response = await api.get(`/attendance-sheets/${sheetId}/records`);
        return response.data;
    },

    saveRecords: async (sheetId: number, records: { student_id: number; status: 'IN_CLASS' | 'NOT_IN_CLASS' }[]): Promise<void> => {
        await api.post(`/attendance-sheets/${sheetId}/records`, { records });
    },
};
