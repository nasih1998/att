import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { attendanceApi } from '../../api/admin';
import type { AttendanceSheet, AttendanceData } from '../../types';

export const AttendanceTable: React.FC = () => {
    const { sheetId } = useParams<{ sheetId: string }>();
    const navigate = useNavigate();
    const [sheet, setSheet] = useState<AttendanceSheet | null>(null);
    const [attendance, setAttendance] = useState<AttendanceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadAttendance();
    }, [sheetId]);

    const loadAttendance = async () => {
        try {
            const data = await attendanceApi.getRecords(Number(sheetId));
            setSheet(data.sheet);
            setAttendance(data.attendance);
        } catch (error) {
            console.error('Failed to load attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: number, status: 'IN_CLASS' | 'NOT_IN_CLASS') => {
        setAttendance(prev =>
            prev.map(item =>
                item.student.id === studentId
                    ? { ...item, status }
                    : item
            )
        );
    };

    const handleSelectAll = (status: 'IN_CLASS' | 'NOT_IN_CLASS') => {
        setAttendance(prev =>
            prev.map(item => ({ ...item, status }))
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const records = attendance
                .filter(item => item.status !== null)
                .map(item => ({
                    student_id: item.student.id,
                    status: item.status!,
                }));

            await attendanceApi.saveRecords(Number(sheetId), records);
            alert('Attendance saved successfully!');
        } catch (error) {
            console.error('Failed to save attendance:', error);
            alert('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="px-4 py-6">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {sheet?.lecture?.name} - {sheet?.week_label} - {sheet?.sheet_label}
                    </h2>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-x-4">
                            <button
                                onClick={() => handleSelectAll('IN_CLASS')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Select ALL In Class
                            </button>
                            <button
                                onClick={() => handleSelectAll('NOT_IN_CLASS')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Select ALL Not In Class
                            </button>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Number
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        In Class
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Not In Class
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendance.map((item) => (
                                    <tr key={item.student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.student.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.student.student_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <input
                                                type="checkbox"
                                                checked={item.status === 'IN_CLASS'}
                                                onChange={() => handleStatusChange(item.student.id, 'IN_CLASS')}
                                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <input
                                                type="checkbox"
                                                checked={item.status === 'NOT_IN_CLASS'}
                                                onChange={() => handleStatusChange(item.student.id, 'NOT_IN_CLASS')}
                                                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
