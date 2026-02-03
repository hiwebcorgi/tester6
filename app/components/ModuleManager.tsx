'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useEditor } from '../EditorProvider';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Megaphone,
    BookOpen,
    Briefcase,
    UserPlus,
    Mail,
    HelpCircle
} from 'lucide-react';

const IconMap: Record<string, any> = {
    'megaphone': Megaphone,
    'book-open': BookOpen,
    'briefcase': Briefcase,
    'user-plus': UserPlus,
    'mail': Mail
};

interface Module {
    id: string;
    name: string;
    type: string;
    active: boolean;
    path: string;
    icon: string;
    navbarVisible: boolean;
    footerVisible: boolean;
    order: number;
    description: string;
}

export default function ModuleManager() {
    const { setEditMode } = useEditor();
    // React Query for loading modules
    const { data: modulesData, isLoading: loading } = useQuery<any>({
        queryKey: ['modules'],
        queryFn: async () => {
            const response = await fetch('/api/modules');
            if (!response.ok) throw new Error('Failed to fetch modules');
            const data = await response.json();
            return data;
        },
    });

    const modules = modulesData?.modules || [];

    // We need local state to handle optimistic updates or batched updates before save
    const [localModules, setLocalModules] = useState<Module[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (modules && Array.isArray(modules) && modules.length > 0) {
            setLocalModules(modules);
        }
    }, [modules]);

    const mutation = useMutation({
        mutationFn: async (updatedModules: Module[]) => {
            const response = await fetch('/api/modules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ modules: updatedModules }),
            });
            if (!response.ok) throw new Error('Failed to save modules');
            return response.json();
        },
        onSuccess: () => {
            toast.success('10초~3분 이내로 변경 적용됩니다');
            setHasChanges(false);
            setEditMode(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
        onError: () => {
            toast.error('저장 실패');
        }
    });

    const saveModules = () => {
        mutation.mutate(localModules);
    };

    const toggleActive = (id: string) => {
        const updated = localModules.map(m =>
            m.id === id ? { ...m, active: !m.active } : m
        );
        setLocalModules(updated);
        setHasChanges(true);
    };



    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">모듈 로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-55px)]">
            {/* Header */}
            <div className="py-4 px-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">모듈 관리</h2>
                <p className="text-sm text-gray-500 mt-1">
                    페이지 모듈을 활성화/비활성화하고 표시 위치를 설정하세요
                </p>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {localModules.map((module) => (
                    <div
                        key={module.id}
                        className={`p-4 rounded-lg border-2 transition-all ${module.active
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 bg-gray-50'
                            }`}
                    >
                        {/* Module Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${module.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {IconMap[module.icon] ? (
                                        React.createElement(IconMap[module.icon], { size: 24 })
                                    ) : (
                                        <span className="text-2xl">{module.icon}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{module.name}</h3>
                                    <p className="text-xs text-gray-500">{module.description}</p>
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <button
                                onClick={() => toggleActive(module.id)}
                                disabled={mutation.isPending}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${module.active
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                    }`}
                            >
                                {module.active ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        {/* Module Details */}
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                                <strong>경로:</strong> {module.path}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer with Save Button */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
                {hasChanges ? (
                    <button
                        onClick={saveModules}
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? '저장 중...' : '✅ 변경하기'}
                    </button>
                ) : (
                    <p className="text-xs text-gray-500 text-center">
                        💡 변경 후 "변경하기" 버튼을 클릭하세요
                    </p>
                )}
            </div>
        </div>
    );
}
