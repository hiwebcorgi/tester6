'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '../components/ModuleLayout';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import Pagination from '@/components/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Portfolio {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    tags: string[];
    link: string;
    date: string;
    content?: string;
}

export default function PortfolioPage() {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
    const [isImageUploading, setIsImageUploading] = useState(false);

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
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Fetch Portfolios
    const { data: portfolios = [], isLoading: loading } = useQuery<Portfolio[]>({
        queryKey: ['portfolios'],
        queryFn: async () => {
            const response = await fetch('/api/portfolio');
            if (!response.ok) throw new Error('Failed to fetch portfolios');
            const data = await response.json();
            return data.portfolios || [];
        }
    });

    // Initial Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: '',
        category: '웹사이트',
        tags: '',
        link: '',
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    });

    // Mutations
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const isEdit = !!data.id;
            const response = await fetch('/api/portfolio', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to save portfolio');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolios'] });
            toast.success('저장되었습니다 (10초~3분 내 반영)');
            closeForm();
        },
        onError: (error) => {
            console.error('Portfolio save error:', error);
            toast.error(`저장 실패: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/portfolio?id=${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete portfolio');
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolios'] });
            toast.success('삭제되었습니다 (10초~3분 내 반영)');
        },
        onError: () => toast.error('삭제 실패'),
    });

    const openForm = (item?: Portfolio) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description,
                content: item.content || '',
                image: item.image,
                category: item.category,
                tags: item.tags.join(', '),
                link: item.link,
                date: item.date,
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                content: '',
                image: '',
                category: '웹사이트',
                tags: '',
                link: '',
                date: new Date().toISOString().slice(0, 10),
            });
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const portfolioData = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            ...(editingItem && { id: editingItem.id }),
        };
        mutation.mutate(portfolioData);
    };

    const handleDelete = (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        deleteMutation.mutate(id);
    };

    return (
        <ModuleLayout>
            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-5xl font-black mb-4">🎨 포트폴리오</h1>
                            <p className="text-xl text-white/60">우리의 작업물을 확인하세요</p>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={() => openForm()}
                                className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                + 새 프로젝트
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : portfolios.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-lg">아직 등록된 포트폴리오가 없습니다.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {portfolios
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500 transition-all group"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 relative overflow-hidden">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-6xl">🎨</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-xl font-bold flex-1">{item.title}</h3>
                                                    {isAuthenticated && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openForm(item)}
                                                                className="text-emerald-400 hover:text-emerald-300 text-sm"
                                                            >
                                                                편집
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="text-red-400 hover:text-red-300 text-sm"
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-white/60 text-sm mb-4">{item.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {item.tags.map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                {item.link && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mr-4"
                                                    >
                                                        외부 링크 →
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/portfolio/${item.id}`}
                                                    className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                                                >
                                                    자세히 보기
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(portfolios.length / itemsPerPage)}
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
                                    {editingItem ? '프로젝트 편집' : '새 프로젝트 추가'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        프로젝트명 *
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
                                        설명 *
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
                                        상세 내용 (HTML 가능)
                                    </label>
                                    <textarea
                                        rows={10}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 font-mono text-sm"
                                        placeholder="<p>상세 내용을 입력하세요...</p>"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            카테고리
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                        >
                                            <option>웹사이트</option>
                                            <option>모바일앱</option>
                                            <option>디자인</option>
                                            <option>기타</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            날짜
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <ImageUploader
                                        label="이미지"
                                        value={formData.image}
                                        onChange={(url) => setFormData({ ...formData, image: url })}
                                        onUploadStart={() => setIsImageUploading(true)}
                                        onUploadEnd={() => setIsImageUploading(false)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        프로젝트 링크
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        태그 (쉼표로 구분)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="React, Next.js, TypeScript"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={mutation.isPending || isImageUploading}
                                        className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {mutation.isPending ? '저장 중...' : isImageUploading ? '이미지 업로드 중...' : editingItem ? '수정하기' : '추가하기'}
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
