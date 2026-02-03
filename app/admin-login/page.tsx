'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (password: string) => {
            const response = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || '비밀번호가 올바르지 않습니다.');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('로그인 성공!');
            window.dispatchEvent(new Event('admin-login-success'));
            setTimeout(() => {
                router.push('/');
            }, 1000);
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(password);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <Toaster position="top-center" />

            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-black text-lg">
                        ZP
                    </div>
                    <span className="font-bold tracking-tighter text-2xl uppercase italic">ZeroPack</span>
                </div>

                {/* Login Card */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                    <h1 className="text-3xl font-black mb-2">관리자 로그인</h1>
                    <p className="text-white/60 mb-8">Visual Editor 접근을 위해 로그인하세요</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                placeholder="관리자 비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    로그인 중...
                                </span>
                            ) : (
                                '로그인'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-sm text-white/40 text-center">
                            💡 로그인 후 Edit Mode를 활성화하여 콘텐츠를 편집할 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-white/60 hover:text-emerald-400 transition-colors"
                    >
                        ← 홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
