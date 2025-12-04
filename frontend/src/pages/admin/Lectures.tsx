import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { adminApi } from '../../api/admin';
import type { Lecture } from '../../types';

export const Lectures: React.FC = () => {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'THEORY' as 'THEORY' | 'PRACTICAL',
        lecturer_id: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    const [lecturers, setLecturers] = useState<any[]>([]);

    useEffect(() => {
        loadLectures();
        loadLecturers();
    }, []);

    const loadLecturers = async () => {
        try {
            const data = await adminApi.getLecturers();
            setLecturers(data);
        } catch (error) {
            console.error('Failed to load lecturers:', error);
        }
    };

    const loadLectures = async () => {
        try {
            const data = await adminApi.getLectures();
            setLectures(data);
        } catch (error) {
            console.error('Failed to load lectures:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                lecturer_id: parseInt(formData.lecturer_id),
            };
            if (editingId) {
                await adminApi.updateLecture(editingId, submitData);
            } else {
                await adminApi.createLecture(submitData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', code: '', type: 'THEORY', lecturer_id: '' });
            loadLectures();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save lecture');
        }
    };

    const handleEdit = (lecture: Lecture) => {
        setFormData({
            name: lecture.name,
            code: lecture.code,
            type: lecture.type,
            lecturer_id: lecture.lecturer_id.toString(),
        });
        setEditingId(lecture.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            try {
                await adminApi.deleteLecture(id);
                loadLectures();
            } catch (error) {
                alert('Failed to delete lecture');
            }
        }
    };

    return (
        <Layout>
            <div className="px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Lectures</h2>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({ name: '', code: '', type: 'THEORY', lecturer_id: '' });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : 'Add Lecture'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Lecture' : 'Add New Lecture'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lecture Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lecture Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'THEORY' | 'PRACTICAL' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="THEORY">Theory</option>
                                    <option value="PRACTICAL">Practical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lecturer
                                </label>
                                <select
                                    value={formData.lecturer_id}
                                    onChange={(e) => setFormData({ ...formData, lecturer_id: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a lecturer...</option>
                                    {lecturers.map((lecturer) => (
                                        <option key={lecturer.id} value={lecturer.id}>
                                            {lecturer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Lecturer
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lectures.map((lecture) => (
                                <tr key={lecture.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {lecture.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lecture.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${lecture.type === 'THEORY'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {lecture.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lecture.lecturer?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(lecture)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lecture.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
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
