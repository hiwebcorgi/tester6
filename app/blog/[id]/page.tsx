'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../components/ModuleLayout';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import BlogSidebar from '../components/BlogSidebar';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    thumbnail: string;
}

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: posts = [], isLoading: loading } = useQuery<BlogPost[]>({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await fetch('/api/blog');
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            return data.posts || [];
        }
    });

    const id = params.id ? decodeURIComponent(params.id as string) : null;
    const post = id ? posts.find((p) => p.id === id || p.id === params.id) : null;

    if (loading) {
        return (
            <ModuleLayout>
                <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            </ModuleLayout>
        );
    }

    if (!post) {
        return (
            <ModuleLayout>
                <div className="pt-24 pb-16 min-h-screen">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-black mb-4">포스트를 찾을 수 없습니다</h1>
                        <p className="text-white/60 mb-8">요청하신 블로그 포스트가 존재하지 않습니다.</p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            블로그 목록으로
                        </Link>
                    </div>
                </div>
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6 flex gap-12">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <article>
                            {/* Back Button */}
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                블로그 목록
                            </Link>

                            {/* Thumbnail */}
                            {post.thumbnail && (
                                <div className="aspect-[2/1] overflow-hidden rounded-2xl mb-8">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Header */}
                            <header className="mb-12">
                                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <time>{new Date(post.date).toLocaleDateString('ko-KR')}</time>
                                    </div>
                                </div>
                            </header>

                            {/* Content */}
                            <div
                                className="blog-content blog-detail-content prose prose-invert prose-lg max-w-none text-white/90"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Back to List */}
                            <div className="mt-12 pt-8 border-t border-white/10 text-center">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-all border border-white/10"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    목록으로 돌아가기
                                </Link>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <BlogSidebar posts={posts} />
                </div>
            </div>
        </ModuleLayout>
    );
}

