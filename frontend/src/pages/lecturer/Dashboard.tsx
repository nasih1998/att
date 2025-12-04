import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import type { Lecture } from '../../types';

export const LecturerDashboard: React.FC = () => {
    // const { user } = useAuth(); // user is no longer needed here
    const [lectures, setLectures] = useState<Lecture[]>([]);

    useEffect(() => {
        // In a real app, fetch lectures for this lecturer
        // For now, we'll use mock data or fetch all and filter
        loadLectures();
    }, []);

    const loadLectures = async () => {
        try {
            const response = await api.get<Lecture[]>('/my-lectures');
            setLectures(response.data);
        } catch (error) {
            console.error('Failed to load lectures:', error);
        }
    };

    return (
        <Layout>
            <div className="px-4 py-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">My Lectures</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lectures.map((lecture) => (
                        <Link
                            key={lecture.id}
                            to={`/lecturer/lectures/${lecture.id}/sheets`}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">{lecture.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${lecture.type === 'THEORY'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {lecture.type}
                                </span>
                            </div>
                            <p className="text-gray-600">Code: {lecture.code}</p>
                        </Link>
                    ))}

                    {lectures.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                            No lectures assigned yet
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
