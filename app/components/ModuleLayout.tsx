// Header, Footer, hooks removed. ModuleLayout is simplified.
import React from 'react';

interface Module {
    id: string;
    name: string;
    path: string;
    icon: string;
    active: boolean;
    navbarVisible: boolean;
    footerVisible: boolean;
    order: number;
}

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-black text-white">
            {children}
        </main>
    );
}
