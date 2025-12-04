import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { adminApi } from '../../api/admin';
import type { AttendanceSheet, Lecture } from '../../types';

export const AttendanceSheets: React.FC = () => {
    const [sheets, setSheets] = useState<AttendanceSheet[]>([]);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        lecture_id: '',
        week_label: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sheetsData, lecturesData] = await Promise.all([
                adminApi.getAttendanceSheets(),
                adminApi.getLectures(),
            ]);
            setSheets(sheetsData);
            setLectures(lecturesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createAttendanceSheet({
                lecture_id: parseInt(formData.lecture_id),
                week_label: formData.week_label,
            });
            setShowForm(false);
            setFormData({ lecture_id: '', week_label: '' });
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create sheet');
        }
    };

    return (
        <Layout>
            <div className="px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Attendance Sheets</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : 'Create Sheet'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Create New Attendance Sheet</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Lecture
                                </label>
                                <select
                                    value={formData.lecture_id}
                                    onChange={(e) => setFormData({ ...formData, lecture_id: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a lecture...</option>
                                    {lectures.map((lecture) => (
                                        <option key={lecture.id} value={lecture.id}>
                                            {lecture.name} ({lecture.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Week Label
                                </label>
                                <input
                                    type="text"
                                    value={formData.week_label}
                                    onChange={(e) => setFormData({ ...formData, week_label: e.target.value })}
                                    required
                                    placeholder="e.g., Week 1, Midterm Review"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Sheet
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Sheet Label
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Lecture
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Week
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sheets.map((sheet) => (
                                <tr key={sheet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {sheet.sheet_label}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {sheet.lecture?.name} ({sheet.lecture?.code})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {sheet.week_label}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date().toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};
