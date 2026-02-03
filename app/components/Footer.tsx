'use client';

import React from 'react';

export default function Footer({
    modules = [],
    settings,
    makeEditable
}: {
    modules?: any[];
    settings?: any;
    makeEditable?: any
}) {
    // Filter active modules
    const footerModules = (modules || [])
        .filter((m: any) => m.active && m.footerVisible)
        .sort((a: any, b: any) => a.order - b.order);

    const safeMakeEditable = makeEditable || (() => ({}));

    return (
        <footer className="py-12 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-4">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white/20 rounded-sm" />
                            <span
                                className="font-bold tracking-tighter uppercase italic text-white"
                                {...safeMakeEditable('settings.company.name', settings?.company?.name || 'ZeroPack Factory', 'Company Name', 'text')}
                            >
                                {settings?.company?.name || 'ZeroPack Factory'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-white/40 items-center md:items-start">
                            <span {...safeMakeEditable('settings.company.ceo', settings?.company?.ceo || 'CEO Name', 'CEO', 'text')}>
                                Owner: {settings?.company?.ceo || 'Hong Gil Dong'}
                            </span>
                            <span {...safeMakeEditable('settings.company.address', settings?.company?.address || 'Company Address', 'Address', 'text')}>
                                Address: {settings?.company?.address || 'Seoul, Republic of Korea'}
                            </span>
                            <span {...safeMakeEditable('settings.company.businessNumber', settings?.company?.businessNumber || '000-00-00000', 'Business Number', 'text')}>
                                Biz License: {settings?.company?.businessNumber || '000-00-00000'}
                            </span>
                            <p
                                className="mt-2"
                                {...safeMakeEditable('settings.company.copyright', settings?.company?.copyright || '© 2026 Zero-Cost Web Factory. All rights reserved.', 'Footer Copyright', 'text')}
                            >
                                {settings?.company?.copyright || '© 2026 Zero-Cost Web Factory. All rights reserved.'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
                        <a href="/terms" className="hover:text-white transition-colors">이용약관</a>
                        <a href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</a>
                    </div>
                </div>
                <div className="text-center pt-4 border-t border-white/5">
                    <a
                        href="/admin-login"
                        className="text-white/20 hover:text-white/40 transition-colors"
                        style={{ fontSize: '12px' }}
                    >
                        관리자로그인
                    </a>
                </div>
            </div>
        </footer>
    );
}
