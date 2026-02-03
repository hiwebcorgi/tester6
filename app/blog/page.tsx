'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '../components/ModuleLayout';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import Pagination from '@/components/Pagination';
import BlogSidebar from './components/BlogSidebar';
import dynamic from 'next/dynamic';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
        </div>
    ),
});

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    thumbnail: string;
    category?: string;
}

export default function BlogPage() {
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [newCategory, setNewCategory] = useState('');
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

    // Fetch Posts
    const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await fetch('/api/blog');
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            return data.posts || [];
        }
    });

    // Fetch Categories
    const { data: categories = [], isLoading: categoriesLoading } = useQuery<string[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/blog/category');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            return data || [];
        }
    });

    // Initial Form Data
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: 'administrator',
        thumbnail: '',
        category: '',
    });

    // Mutations
    const categoryMutation = useMutation({
        mutationFn: async (updatedCategories: string[]) => {
            const response = await fetch('/api/blog/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedCategories),
            });
            if (!response.ok) throw new Error('Failed to save categories');
            return updatedCategories;
        },
        onSuccess: (updatedCategories) => {
            queryClient.setQueryData(['categories'], updatedCategories);
            toast.success('카테고리가 저장되었습니다');
            setNewCategory('');
        },
        onError: () => toast.error('카테고리 저장 실패'),
    });

    const postMutation = useMutation({
        mutationFn: async (postData: any) => {
            const isEdit = !!postData.id;
            const response = await fetch('/api/blog', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(postData),
            });
            if (!response.ok) throw new Error('Failed to save post');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('저장되었습니다 (10초~3분 내 반영)');
            closeForm();
        },
        onError: () => toast.error('저장 실패'),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/blog?id=${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete post');
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('삭제되었습니다 (10초~3분 내 반영)');
        },
        onError: () => toast.error('삭제 실패'),
    });

    // Event Handlers
    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newCategory.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        categoryMutation.mutate([...categories, trimmed]);
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        if (!confirm(`'${categoryToDelete}' 카테고리를 삭제하시겠습니까?`)) return;
        categoryMutation.mutate(categories.filter(c => c !== categoryToDelete));
    };

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const postData = {
            ...formData,
            ...(editingPost && { id: editingPost.id, date: editingPost.date }),
        };
        postMutation.mutate(postData);
    };

    const handleDeletePost = (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        deleteMutation.mutate(id);
    };

    const openForm = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author,
                thumbnail: post.thumbnail,
                category: post.category || (categories[0] || '기타'),
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                author: 'Administrator',
                thumbnail: '',
                category: categories[0] || '기타',
            });
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingPost(null);
    };

    // Filter Posts
    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when filter changes
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <ModuleLayout>
            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-5xl font-black mb-4">📝 블로그</h1>
                            <p className="text-xl text-white/60">인사이트와 노하우 공유</p>
                        </div>
                        {isAuthenticated && (
                            <div className="flex items-center">
                                <button
                                    onClick={() => openForm()}
                                    className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    + 새 포스트
                                </button>
                                <button
                                    onClick={() => setShowCategoryManager(true)}
                                    className="px-4 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all ml-2"
                                >
                                    📂 카테고리 관리
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Category Filter UI - Modern Pills */}
                    <div className="w-full flex flex-wrap gap-2 mb-12">
                        <button
                            onClick={() => handleCategoryChange('All')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === 'All'
                                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-105'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            전체보기
                        </button>
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-105'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="w-full flex gap-12">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {postsLoading || categoriesLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                                </div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-4xl block mb-4">📭</span>
                                    <p className="text-white/40 text-lg">해당 카테고리에 포스트가 없습니다.</p>
                                    {selectedCategory !== 'All' && (
                                        <button
                                            onClick={() => handleCategoryChange('All')}
                                            className="mt-4 text-emerald-400 hover:text-emerald-300 underline"
                                        >
                                            전체 글 보기
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-8">
                                        {paginatedPosts.map((post) => (
                                            <article
                                                key={post.id}
                                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500 transition-all"
                                            >
                                                {post.thumbnail && (
                                                    <div className="aspect-[2/1] overflow-hidden">
                                                        <img
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-8">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <span className="text-4xl">📝</span>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h2 className="text-2xl font-bold">{post.title}</h2>
                                                                {isAuthenticated && (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => openForm(post)}
                                                                            className="text-emerald-400 hover:text-emerald-300 text-sm"
                                                                        >
                                                                            편집
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeletePost(post.id)}
                                                                            className="text-red-400 hover:text-red-300 text-sm"
                                                                        >
                                                                            삭제
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-white/40 text-sm mt-1">
                                                                <span>{post.author}</span>
                                                                <span>•</span>
                                                                <span>{post.date}</span>
                                                                {post.category && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleCategoryChange(post.category!);
                                                                            }}
                                                                            className="text-emerald-400 cursor-pointer hover:underline"
                                                                        >
                                                                            {post.category}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-white/60 leading-relaxed mb-4">{post.excerpt}</p>

                                                    <Link
                                                        href={`/blog/${post.id}`}
                                                        className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                                                    >
                                                        자세히 보기 →
                                                    </Link>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages > 0 ? totalPages : 1}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="w-80 hidden lg:block">
                            <BlogSidebar posts={posts} />

                            {/* Categories List in Sidebar as well */}
                            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span>📂</span> 카테고리
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => handleCategoryChange('All')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'All'
                                                ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            전체보기 ({posts.length})
                                        </button>
                                    </li>
                                    {categories.map((cat, i) => {
                                        const count = posts.filter(p => p.category === cat).length;
                                        return (
                                            <li key={i}>
                                                <button
                                                    onClick={() => handleCategoryChange(cat)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between ${selectedCategory === cat
                                                        ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    <span>{cat}</span>
                                                    <span className="opacity-50">{count}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Modal */}
                {
                    showForm && (
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
                                            {editingPost ? '포스트 편집' : '새 포스트 작성'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
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
                                                요약 *
                                            </label>
                                            <textarea
                                                required
                                                rows={2}
                                                value={formData.excerpt}
                                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                카테고리
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                            >
                                                <option value="" disabled>카테고리 선택</option>
                                                {categories.map((cat, i) => (
                                                    <option key={i} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                내용 *
                                            </label>
                                            <RichTextEditor
                                                value={formData.content}
                                                onChange={(value) => setFormData({ ...formData, content: value })}
                                                placeholder="블로그 내용을 작성하세요... 이미지를 드래그하거나 버튼을 클릭하여 추가할 수 있습니다."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    작성자
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.author}
                                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                                />
                                            </div>

                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <ImageUploader
                                                    label="썸네일 이미지"
                                                    value={formData.thumbnail}
                                                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                                                    onUploadStart={() => setIsImageUploading(true)}
                                                    onUploadEnd={() => setIsImageUploading(false)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={postMutation.isPending || isImageUploading}
                                                className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {postMutation.isPending ? '저장 중...' : isImageUploading ? '이미지 업로드 중...' : editingPost ? '수정하기' : '발행하기'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeForm}
                                                disabled={postMutation.isPending}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )
                }
                {/* Category Manager Modal */}
                {
                    showCategoryManager && (
                        <>
                            <div onClick={() => setShowCategoryManager(false)} className="fixed inset-0 bg-black/70 z-50" />
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-xl max-w-md w-full relative p-6">
                                    <button
                                        onClick={() => setShowCategoryManager(false)}
                                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        ✕
                                    </button>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">📂 카테고리 관리</h2>

                                    <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="새 카테고리 이름"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newCategory.trim() || categoryMutation.isPending}
                                            className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                                        >
                                            추가
                                        </button>
                                    </form>

                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {categories.map((cat, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="font-medium text-gray-700">{cat}</span>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="text-red-400 hover:text-red-600 text-sm font-bold px-2 py-1"
                                                    disabled={categoryMutation.isPending}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        ))}
                                        {categories.length === 0 && (
                                            <p className="text-gray-400 text-center py-4">카테고리가 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </ModuleLayout>
    );
}
