'use client';

import ModuleLayout from '../components/ModuleLayout';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <ModuleLayout>
            <div className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-lg mx-auto px-6">
                    {/* Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            문의 남기기
                        </h1>
                        <p className="text-white/50">
                            아래 양식을 작성해 주시면 빠른 시일 내에 답변 드리겠습니다.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </ModuleLayout>
    );
}
