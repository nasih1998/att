import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';

export const AdminDashboard: React.FC = () => {
    return (
        <Layout>
            <div className="px-4 py-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        to="/admin/students"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Students</h3>
                                <p className="text-gray-600 mt-2">Manage student records</p>
                            </div>
                            <div className="text-blue-600 text-3xl">👨‍🎓</div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/lecturers"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Lecturers</h3>
                                <p className="text-gray-600 mt-2">Manage lecturer accounts</p>
                            </div>
                            <div className="text-green-600 text-3xl">👨‍🏫</div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/lectures"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Lectures</h3>
                                <p className="text-gray-600 mt-2">Manage lecture courses</p>
                            </div>
                            <div className="text-purple-600 text-3xl">📚</div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/attendance-sheets"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Attendance Sheets</h3>
                                <p className="text-gray-600 mt-2">Create attendance sheets</p>
                            </div>
                            <div className="text-orange-600 text-3xl">📋</div>
                        </div>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};
