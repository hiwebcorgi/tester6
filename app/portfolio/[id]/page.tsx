'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../components/ModuleLayout';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, ExternalLink, Tag } from 'lucide-react';

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

export default function PortfolioDetailPage() {
    const params = useParams();
    const { data: portfolios = [], isLoading: loading } = useQuery<Portfolio[]>({
        queryKey: ['portfolios'],
        queryFn: async () => {
            const response = await fetch('/api/portfolio');
            if (!response.ok) throw new Error('Failed to fetch portfolios');
            const data = await response.json();
            return data.portfolios || [];
        }
    });

    const portfolio = portfolios.find((p) => p.id === params.id) || null;

    if (loading) {
        return (
            <ModuleLayout>
                <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            </ModuleLayout>
        );
    }

    if (!portfolio) {
        return (
            <ModuleLayout>
                <div className="pt-24 pb-16 min-h-screen">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-black mb-4">포트폴리오를 찾을 수 없습니다</h1>
                        <p className="text-white/60 mb-8">요청하신 포트폴리오가 존재하지 않습니다.</p>
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            포트폴리오 목록으로
                        </Link>
                    </div>
                </div>
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="pt-24 pb-16">
                <article className="max-w-4xl mx-auto px-6">
                    {/* Back Button */}
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        포트폴리오 목록
                    </Link>

                    {/* Image */}
                    {portfolio.image && (
                        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-white/10">
                            <img
                                src={portfolio.image}
                                alt={portfolio.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                                {portfolio.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            {portfolio.title}
                        </h1>

                        <div className="flex items-center gap-4 text-white/50 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time>{new Date(portfolio.date).toLocaleDateString('ko-KR')}</time>
                            </div>
                        </div>
                    </header>

                    {/* Description & Content */}
                    <div className="prose prose-invert prose-lg max-w-none mb-8">
                        <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap mb-8">
                            {portfolio.description}
                        </p>
                        {portfolio.content && (
                            <div
                                className="text-white/80 leading-relaxed portfolio-content"
                                dangerouslySetInnerHTML={{ __html: portfolio.content }}
                            />
                        )}
                    </div>

                    {/* Link */}
                    {portfolio.link && (
                        <a
                            href={portfolio.link.startsWith('http') ? portfolio.link : `https://${portfolio.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all mb-8"
                        >
                            <ExternalLink className="w-4 h-4" />
                            프로젝트 보기
                        </a>
                    )}

                    {/* Tags */}
                    {portfolio.tags && portfolio.tags.length > 0 && (
                        <div className="pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-4 h-4 text-white/50" />
                                <span className="text-white/50 text-sm">기술 스택</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {portfolio.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 bg-white/5 text-white/70 text-sm rounded-full border border-white/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to List */}
                    <div className="mt-12 pt-8 border-t border-white/10 text-center">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-all border border-white/10"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            목록으로 돌아가기
                        </Link>
                    </div>
                </article>
            </div>
        </ModuleLayout>
    );
}
