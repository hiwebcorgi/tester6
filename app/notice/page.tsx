'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import toast from 'react-hot-toast';
import { Pin, Calendar, X } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notice {
    id: string;
    title: string;
    date: string;
    important: boolean;
    content: string;
}

export default function NoticePage() {
    const queryClient = useQueryClient();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        important: false,
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/admin-auth', { credentials: 'include' });
            setIsAuthenticated(response.ok);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    // React Query for Notices
    const { data: notices = [], isLoading: loading } = useQuery<Notice[]>({
        queryKey: ['notices'],
        queryFn: async () => {
            const response = await fetch('/api/notice');
            if (!response.ok) throw new Error('Failed to fetch notices');
            const data = await response.json();
            return data.notices || [];
        }
    });

    // Mutations
    const saveMutation = useMutation({
        mutationFn: async (noticeData: any) => {
            const isEdit = !!editingNotice;
            const response = await fetch('/api/notice', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(noticeData),
            });
            if (!response.ok) throw new Error('Failed to save notice');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
            toast.success('저장되었습니다 (10초~3분 내 반영)');
            closeForm();
        },
        onError: () => {
            toast.error('저장 실패');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/notice?id=${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete notice');
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
            toast.success('삭제되었습니다 (10초~3분 내 반영)');
            if (selectedNotice) closeDetail();
        },
        onError: () => {
            toast.error('삭제 실패');
        }
    });

    const openForm = (notice?: Notice) => {
        if (notice) {
            setEditingNotice(notice);
            setFormData({
                title: notice.title,
                content: notice.content,
                important: notice.important,
            });
        } else {
            setEditingNotice(null);
            setFormData({
                title: '',
                content: '',
                important: false,
            });
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingNotice(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const noticeData = {
            ...formData,
            ...(editingNotice && { id: editingNotice.id, date: editingNotice.date }),
        };
        saveMutation.mutate(noticeData);
    };

    const handleDelete = (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        deleteMutation.mutate(id);
    };

    const handleNoticeClick = (notice: Notice) => {
        setSelectedNotice(notice);
    };

    const closeDetail = () => {
        setSelectedNotice(null);
    };

    return (
        <ModuleLayout>
            <div className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-5xl font-black mb-4">📢 공지사항</h1>
                            <p className="text-xl text-white/60">최신 소식과 업데이트</p>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={() => openForm()}
                                className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all"
                            >
                                + 새 공지
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-lg">아직 작성된 공지사항이 없습니다.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {notices
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((notice) => (
                                        <article
                                            key={notice.id}
                                            onClick={() => handleNoticeClick(notice)}
                                            className={`p-8 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/50 hover:scale-[1.01] ${notice.important
                                                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
                                                : 'bg-white/5 border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    {notice.important && (
                                                        <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                                                            <Pin className="w-3 h-3" />
                                                            중요
                                                        </span>
                                                    )}
                                                    <h2 className="text-2xl font-bold">{notice.title}</h2>
                                                </div>
                                                {isAuthenticated && (
                                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => openForm(notice)}
                                                            className="text-emerald-400 hover:text-emerald-300 text-sm"
                                                        >
                                                            편집
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(notice.id)}
                                                            className="text-red-400 hover:text-red-300 text-sm"
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-white/40">
                                                <Calendar className="w-4 h-4" />
                                                <time>{new Date(notice.date).toLocaleDateString('ko-KR')}</time>
                                            </div>
                                        </article>
                                    ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(notices.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Detail Panel - Slides up from bottom */}
            {selectedNotice && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={closeDetail}
                    />

                    {/* Detail Panel */}
                    <div className="fixed inset-x-0 bottom-0 z-50 animate-slideUp">
                        <div className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
                            <div className="container mx-auto px-6 py-8 max-w-4xl relative">
                                {/* Close Button */}
                                <button
                                    onClick={closeDetail}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        {selectedNotice.important && (
                                            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                                                <Pin className="w-3 h-3" />
                                                중요
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                                        {selectedNotice.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-white/40">
                                        <Calendar className="w-4 h-4" />
                                        <time>
                                            {new Date(selectedNotice.date).toLocaleDateString('ko-KR')}
                                        </time>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
                                        {selectedNotice.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Form Modal */}
            {showForm && (
                <>
                    <div onClick={closeForm} className="fixed inset-0 bg-black/70 z-50" />
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl max-w-2xl w-full my-8 relative">
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
                                    {editingNotice ? '공지사항 편집' : '새 공지사항 작성'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        제목 *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        내용 *
                                    </label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="공지 내용을 작성하세요..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="important"
                                        checked={formData.important}
                                        onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                                    />
                                    <label htmlFor="important" className="text-sm font-medium text-gray-700">
                                        중요 공지로 표시 (상단 고정)
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saveMutation.isPending}
                                        className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                                    >
                                        {saveMutation.isPending ? '저장 중...' : editingNotice ? '수정하기' : '발행하기'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={saveMutation.isPending}
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
