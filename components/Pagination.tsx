'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-12">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all
                    ${currentPage === 1
                        ? 'text-white/20 cursor-not-allowed'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                aria-label="이전 페이지"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => {
                if (page === 'ellipsis') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex items-center justify-center w-10 h-10 text-white/40"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </span>
                    );
                }

                const isActive = page === currentPage;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all
                            ${isActive
                                ? 'bg-emerald-500 text-black'
                                : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        aria-label={`${page}페이지`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all
                    ${currentPage === totalPages
                        ? 'text-white/20 cursor-not-allowed'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                aria-label="다음 페이지"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
