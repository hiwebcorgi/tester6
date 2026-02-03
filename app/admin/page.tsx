'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

export default function AdminPage() {
    const router = useRouter();
    const { isLoading } = useQuery({
        queryKey: ['adminAuth'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/admin-auth', { credentials: 'include' });
                if (response.ok) {
                    toast.success('이미 로그인이 되어 있습니다');
                    router.replace('/');
                    return true;
                }
                throw new Error('Not authenticated');
            } catch {
                router.replace('/admin-login');
                return false;
            }
        },
        retry: false
    });

    if (isLoading) {
        // loading UI (will fall through to return below)
    }

    // Show loading state while checking authentication
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
            color: 'white',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>인증 확인 중...</p>
            </div>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
