'use client';

import React, { useState } from 'react';
import { Calendar, Pin, X } from 'lucide-react';

interface Notice {
    title: string;
    date: string;
    important?: boolean;
    content: string;
    slug: string;
}

interface NoticeListClientProps {
    notices: Notice[];
}

export default function NoticeListClient({ notices }: NoticeListClientProps) {
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    const handleNoticeClick = (notice: Notice) => {
        setSelectedNotice(notice);
    };

    const handleClose = () => {
        setSelectedNotice(null);
    };

    return (
        <>
            {/* Notice List */}
            <div className="space-y-4">
                {notices.map((notice) => (
                    <article
                        key={notice.slug}
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
                        </div>

                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <Calendar className="w-4 h-4" />
                            <time>{new Date(notice.date).toLocaleDateString('ko-KR')}</time>
                        </div>
                    </article>
                ))}
            </div>

            {/* Detail Panel - Slides up from bottom */}
            {selectedNotice && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
                        onClick={handleClose}
                    />

                    {/* Detail Panel */}
                    <div className="fixed inset-x-0 bottom-0 z-50 animate-slideUp">
                        <div className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
                            <div className="container mx-auto px-6 py-8 max-w-4xl">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
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
        </>
    );
}
