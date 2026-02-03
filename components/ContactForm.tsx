'use client';

import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { useMutation } from '@tanstack/react-query';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading'>('idle');
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return '이름을 입력해주세요';
                }
                if (value.trim().length < 2) {
                    return '이름은 최소 2자 이상이어야 합니다';
                }
                return '';
            case 'email':
                if (!value.trim()) {
                    return '이메일을 입력해주세요';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return '올바른 이메일 형식이 아닙니다';
                }
                return '';
            case 'message':
                if (!value.trim()) {
                    return '메시지를 입력해주세요';
                }
                if (value.trim().length < 10) {
                    return '메시지는 최소 10자 이상이어야 합니다';
                }
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const validateForm = () => {
        const newErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            message: validateField('message', formData.message),
        };

        setErrors(newErrors);

        return !newErrors.name && !newErrors.email && !newErrors.message;
    };

    const submitMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Form submission failed');
            }
            return result;
        },
        onSuccess: () => {
            toast.dismiss();
            setStatus('idle');
            setFormData({ name: '', email: '', message: '' });
            recaptchaRef.current?.reset();

            toast.success('메시지가 성공적으로 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.', {
                duration: 5000,
                position: 'top-center',
                icon: '✅',
            });
        },
        onError: (error) => {
            console.error('Form submission error:', error);
            toast.dismiss();
            setStatus('idle');
            recaptchaRef.current?.reset();

            toast.error('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
                duration: 4000,
                position: 'top-center',
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        if (!validateForm()) {
            toast.error('모든 필드를 올바르게 입력해주세요', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        // Get reCAPTCHA token
        const recaptchaToken = recaptchaRef.current?.getValue();
        if (!recaptchaToken) {
            toast.error('reCAPTCHA 인증을 완료해주세요', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        setStatus('loading');
        toast.loading('메시지를 전송하는 중...');

        try {
            const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
            if (!WEB3FORMS_KEY) {
                throw new Error('Web3Forms API key is not configured');
            }

            submitMutation.mutate({
                access_key: WEB3FORMS_KEY,
                name: formData.name,
                email: formData.email,
                message: formData.message,
                subject: `[ZeroPack] 새로운 문의: ${formData.name}님`,
                from_name: 'ZeroPack Contact Form',
            });
        } catch (error) {
            toast.error('설정 오류가 발생했습니다.');
            setStatus('idle');
        }
    };


    return (
        <section id="contact" className="w-full">
            <Toaster />
            <div className="w-full">
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6"
                    noValidate
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                            이름 <span className="text-emerald-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.name
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-white/10 focus:border-emerald-500'
                                } text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors`}
                            placeholder="홍길동"
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                            이메일 <span className="text-emerald-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.email
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-white/10 focus:border-emerald-500'
                                } text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors`}
                            placeholder="example@email.com"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">
                            메시지 <span className="text-emerald-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={5}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.message
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-white/10 focus:border-emerald-500'
                                } text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors resize-none`}
                            placeholder="문의 내용을 입력해주세요 (최소 10자)"
                        />
                        {errors.message && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <span>⚠️</span> {errors.message}
                            </p>
                        )}
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex justify-start">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY || ''}
                            theme="dark"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-emerald-500 text-black font-bold py-4 rounded-lg hover:bg-emerald-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                전송 중...
                            </span>
                        ) : '문의 보내기'}
                    </button>
                </form>
            </div>
        </section>
    );
}
