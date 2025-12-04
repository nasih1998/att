import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { attendanceApi } from '../../api/admin';
import type { AttendanceSheet } from '../../types';

export const LectureSheets: React.FC = () => {
    const { lectureId } = useParams<{ lectureId: string }>();
    const [sheets, setSheets] = useState<AttendanceSheet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSheets();
    }, [lectureId]);

    const loadSheets = async () => {
        try {
            const data = await attendanceApi.getSheets(Number(lectureId));
            setSheets(data);
        } catch (error) {
            console.error('Failed to load sheets:', error);
        } finally {
            setLoading(false);
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
                <Link to="/lecturer" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                    ← Back to My Lectures
                </Link>

                <h2 className="text-3xl font-bold text-gray-900 mb-8">Attendance Sheets</h2>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Week
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sheet
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sheets.map((sheet) => (
                                <tr key={sheet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {sheet.week_label}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {sheet.sheet_label}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/lecturer/attendance/${sheet.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Mark Attendance →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {sheets.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No attendance sheets created yet
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
