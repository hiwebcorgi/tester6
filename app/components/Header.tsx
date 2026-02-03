'use client';

import Link from 'next/link';

import React from 'react';
import { useEditor } from '../EditorProvider';
import { usePathname } from 'next/navigation';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Header({
    modules = [],
    settings,
    makeEditable
}: {
    modules?: any[];
    settings?: any;
    makeEditable?: any
}) {
    const { editMode, registerField, focusOnField, getFieldValue } = useEditor();
    const pathname = usePathname();

    // Filter active modules
    const navbarModules = (modules || [])
        .filter((m: any) => m.active && m.navbarVisible)
        .sort((a: any, b: any) => a.order - b.order);

    // Live preview values for logo settings - simpler derivation
    const logoType = getFieldValue('settings.logoType') || settings?.logoType || 'text';
    const logoImage = getFieldValue('settings.logoImage') || settings?.logoImage || '';
    const siteTitle = getFieldValue('settings.siteTitle') || settings?.siteTitle || 'ZeroPack';
    const logoText = getFieldValue('settings.logo') || settings?.logo || 'ZP';

    // Group registration for logo settings
    const handleLogoEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Register all related fields so they appear in VisualEditor
        registerField({
            path: 'settings.logoType',
            value: logoType,
            label: '로고 타입',
            type: 'select',
            options: [
                { label: '사이트제목 + 로고텍스트 (기본)', value: 'text' },
                { label: '로고 이미지만 사용', value: 'image' },
                { label: '로고 이미지 + 사이트제목 사용', value: 'image-text' }
            ]
        });
        registerField({ path: 'settings.logo', value: logoText, label: '로고 텍스트', type: 'text' });
        registerField({ path: 'settings.siteTitle', value: siteTitle, label: '사이트 제목', type: 'text' });
        registerField({ path: 'settings.logoImage', value: logoImage, label: '로고 이미지', type: 'image' });

        focusOnField('settings.logoType');
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 ${editMode ? 'cursor-default' : 'cursor-pointer hover:opacity-80 transition-opacity'}`}
                        onClick={(e) => {
                            if (editMode) e.preventDefault();
                        }}
                    >
                        {/* Logo section */}
                        {(logoType === 'image' || logoType === 'image-text') && logoImage ? (
                            <div className="h-8 relative">
                                <img src={logoImage} alt={siteTitle} className="h-full w-auto object-contain" />
                            </div>
                        ) : (logoType === 'text' || !logoType || ((logoType === 'image' || logoType === 'image-text') && !logoImage)) ? (
                            <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-black text-xs shadow-lg shadow-emerald-500/20">
                                {logoText}
                            </div>
                        ) : null}

                        {/* Title section */}
                        {(logoType === 'text' || logoType === 'image-text' || !logoType || ((logoType === 'image' || logoType === 'image-text') && !logoImage)) && (
                            <span className="font-bold tracking-tighter text-xl uppercase italic text-white">
                                {siteTitle}
                            </span>
                        )}
                    </Link>

                    {/* Logo Settings Button - Enlarged and animated */}
                    {editMode && (
                        <button
                            onClick={handleLogoEditClick}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 group active:scale-95"
                            style={{ outline: '2px dashed rgba(16, 185, 129, 0.4)', outlineOffset: '2px' }}
                        >
                            <SettingsIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="text-base uppercase tracking-tight">로고수정</span>
                        </button>
                    )}
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                    {navbarModules.map((module: any) => (
                        <a
                            key={module.id}
                            href={module.path}
                            className={`transition-colors ${pathname === module.path
                                ? 'text-emerald-400 font-bold'
                                : 'hover:text-emerald-400'
                                }`}
                            title={module.description}
                        >
                            {module.name}
                        </a>
                    ))}
                </div>
                <div className="w-8"></div>
            </div>
        </nav>
    );
}
