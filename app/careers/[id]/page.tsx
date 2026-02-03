'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../components/ModuleLayout';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, Briefcase, Clock, CheckCircle2, Gift } from 'lucide-react';

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

export default function CareersDetailPage() {
    const params = useParams();
    const { data: jobs = [], isLoading: loading } = useQuery<Job[]>({
        queryKey: ['careers'],
        queryFn: async () => {
            const response = await fetch('/api/careers');
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            return data.jobs || [];
        }
    });

    const id = params.id ? decodeURIComponent(params.id as string) : null;
    const job = id ? jobs.find((j) => j.id === id || j.id === params.id) : null;

    if (loading) {
        return (
            <ModuleLayout>
                <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            </ModuleLayout>
        );
    }

    if (!job) {
        return (
            <ModuleLayout>
                <div className="pt-24 pb-16 min-h-screen">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-black mb-4">채용 공고를 찾을 수 없습니다</h1>
                        <p className="text-white/60 mb-8">요청하신 채용 공고가 존재하지 않습니다.</p>
                        <Link
                            href="/careers"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            채용 공고 목록으로
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
                        href="/careers"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        채용 공고 목록
                    </Link>

                    {/* Header */}
                    <header className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/20">
                                {job.department}
                            </span>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${job.active
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/20 text-red-400 border border-red-500/20'
                                }`}>
                                {job.active ? '채용 중' : '마감'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            {job.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>게시: {new Date(job.postedDate).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>마감: {job.deadline}</span>
                            </div>
                        </div>
                    </header>

                    {/* Description */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-emerald-400" />
                            직무 소개
                        </h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-inner">
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-lg">
                                {job.description}
                            </p>
                        </div>
                    </section>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                자격 요건
                            </h2>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-inner">
                                <ul className="space-y-4">
                                    {job.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                            <span className="text-white/80 text-lg">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Gift className="w-6 h-6 text-emerald-400" />
                                복리후생
                            </h2>
                            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-8 shadow-xl">
                                <ul className="grid md:grid-cols-2 gap-6">
                                    {job.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                            <span className="text-white/80 text-lg">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    {/* Apply Button */}
                    {job.active && (
                        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl mb-12 shadow-inner">
                            <h2 className="text-2xl font-bold mb-6">이 포지션에 도전하세요!</h2>
                            <a
                                href={`mailto:${job.applicationEmail || 'careers@zeropack.io'}`}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 text-black font-bold text-xl rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 scale-110 mb-6 hover:scale-115"
                            >
                                지원하기
                            </a>
                            <p className="text-white/40 text-sm">
                                이력서를 <span className="text-emerald-400 font-bold">{job.applicationEmail || 'careers@zeropack.io'}</span>로 보내주세요
                            </p>
                        </div>
                    )}

                    {/* Back to List */}
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <Link
                            href="/careers"
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

