'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '../components/ModuleLayout';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Job {
    id: string;
    title: string;
    type: string;
    location: string;
    department: string;
    description: string;
    requirements: string[];
    benefits: string[];
    deadline: string;
    active: boolean;
    postedDate: string;
    applicationEmail?: string;
}

export default function CareersPage() {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    // Auth Check
    const { data: isAuthenticated = false } = useQuery({
        queryKey: ['isAuthenticated'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/admin-auth', { credentials: 'include' });
                return response.ok;
            } catch {
                return false;
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch Jobs
    const { data: jobs = [], isLoading: loading } = useQuery<Job[]>({
        queryKey: ['careers'],
        queryFn: async () => {
            const response = await fetch('/api/careers');
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            return data.jobs || [];
        }
    });

    // Initial Form State
    const [formData, setFormData] = useState({
        title: '',
        type: '정규직',
        location: '서울',
        department: '개발팀',
        description: '',
        requirements: '',
        benefits: '',
        deadline: '',
        applicationEmail: 'careers@zeropack.io',
    });

    // Mutations
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const isEdit = !!data.id;
            const response = await fetch('/api/careers', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to save job');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['careers'] });
            toast.success('저장되었습니다 (10초~3분 내 반영)');
            closeForm();
        },
        onError: (error) => {
            console.error('Job save error:', error);
            toast.error(`저장 실패: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/careers?id=${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete job');
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['careers'] });
            toast.success('삭제되었습니다 (10초~3분 내 반영)');
        },
        onError: () => toast.error('삭제 실패'),
    });

    const openForm = (job?: Job) => {
        if (job) {
            setEditingJob(job);
            setFormData({
                title: job.title,
                type: job.type,
                location: job.location,
                department: job.department,
                description: job.description,
                requirements: job.requirements.join('\n'),
                benefits: job.benefits.join('\n'),
                deadline: job.deadline,
                applicationEmail: job.applicationEmail || 'careers@zeropack.io',
            });
        } else {
            setEditingJob(null);
            setFormData({
                title: '',
                type: '정규직',
                location: '서울',
                department: '개발팀',
                description: '',
                requirements: '',
                benefits: '',
                deadline: '',
                applicationEmail: 'careers@zeropack.io',
            });
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingJob(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const jobData = {
            ...formData,
            requirements: formData.requirements.split('\n').filter(r => r.trim()),
            benefits: formData.benefits.split('\n').filter(b => b.trim()),
            ...(editingJob && {
                id: editingJob.id,
                postedDate: editingJob.postedDate,
                active: editingJob.active
            }),
        };
        mutation.mutate(jobData);
    };

    const handleDelete = (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        deleteMutation.mutate(id);
    };

    const activeJobs = (jobs || []).filter(j => j.active);

    return (
        <ModuleLayout>
            <div className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-5xl font-black mb-4">💼 채용</h1>
                            <p className="text-xl text-white/60">함께 성장할 팀원을 찾습니다</p>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={() => openForm()}
                                className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                + 새 공고 등록
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : activeJobs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-lg">현재 진행 중인 채용 공고가 없습니다.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-6">
                                {activeJobs
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((job) => (
                                        <div
                                            key={job.id}
                                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                                                    <div className="flex gap-3 text-sm flex-wrap">
                                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                                                            {job.type}
                                                        </span>
                                                        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full">
                                                            📍 {job.location}
                                                        </span>
                                                        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full">
                                                            🏢 {job.department}
                                                        </span>
                                                        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full">
                                                            ⏰ ~{job.deadline}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {isAuthenticated && (
                                                        <>
                                                            <button
                                                                onClick={() => openForm(job)}
                                                                className="text-emerald-400 hover:text-emerald-300 text-sm"
                                                            >
                                                                편집
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(job.id)}
                                                                className="text-red-400 hover:text-red-300 text-sm"
                                                            >
                                                                삭제
                                                            </button>
                                                        </>
                                                    )}

                                                    <Link
                                                        href={`/careers/${job.id}`}
                                                        className="px-6 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/10"
                                                    >
                                                        자세히 →
                                                    </Link>
                                                </div>
                                            </div>

                                            <p className="text-white/60 mb-4">{job.description}</p>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-sm font-bold text-emerald-400 mb-2">자격 요건</h3>
                                                    <ul className="space-y-1 text-sm text-white/60">
                                                        {job.requirements.map((req, i) => (
                                                            <li key={i}>• {req}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-emerald-400 mb-2">혜택</h3>
                                                    <ul className="space-y-1 text-sm text-white/60">
                                                        {job.benefits.map((benefit, i) => (
                                                            <li key={i}>• {benefit}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(activeJobs.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <>
                    <div onClick={closeForm} className="fixed inset-0 bg-black/70 z-50" />
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl max-w-3xl w-full my-8 relative">
                            {/* Close Button */}
                            <button
                                onClick={closeForm}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors z-10"
                                type="button"
                            >
                                ✕
                            </button>
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingJob ? '채용 공고 편집' : '새 채용 공고 등록'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        직무 *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Frontend Developer"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            고용 형태
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                        >
                                            <option>정규직</option>
                                            <option>계약직</option>
                                            <option>인턴</option>
                                            <option>프리랜서</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            근무지
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            부서
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        직무 설명 *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        자격 요건 (한 줄에 하나씩)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                        placeholder="React 3년 이상 경력&#10;TypeScript 사용 경험&#10;..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        혜택 (한 줄에 하나씩)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.benefits}
                                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                        placeholder="연봉 협의&#10;재택근무 가능&#10;..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        마감일 *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        지원 이메일 *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.applicationEmail}
                                        onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
                                        placeholder="careers@zeropack.io"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                                    >
                                        {mutation.isPending ? '저장 중...' : editingJob ? '수정하기' : '등록하기'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={mutation.isPending}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                                    >
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </ModuleLayout>
    );
}
