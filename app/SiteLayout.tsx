'use client';

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useQuery } from '@tanstack/react-query';
import { useMakeEditable } from './hooks/useMakeEditable';

interface SiteLayoutProps {
    children: React.ReactNode;
    initialModules: any;
    initialSettings: any;
}

export default function SiteLayout({ children, initialModules, initialSettings }: SiteLayoutProps) {
    const { makeEditable } = useMakeEditable();

    // Use React Query for modules to keep them sync
    const { data: modulesData } = useQuery({
        queryKey: ['modules'],
        queryFn: async () => {
            const response = await fetch('/api/modules');
            if (!response.ok) return { modules: [] };
            return response.json();
        },
        initialData: initialModules,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Use React Query for settings
    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await fetch('/api/content/load?file=content/settings.json');
            if (!response.ok) return {};
            return response.json();
        },
        initialData: initialSettings,
        staleTime: 1000 * 60 * 5,
    });

    const modules = modulesData?.modules || [];

    return (
        <div className="flex flex-col min-h-screen">
            <Header modules={modules} settings={settings} makeEditable={makeEditable} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer modules={modules} settings={settings} makeEditable={makeEditable} />
        </div>
    );
}
