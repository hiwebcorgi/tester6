'use client';
import { useEditor } from '../EditorProvider';
import { useQuery } from '@tanstack/react-query';
import ModuleLayout from '../components/ModuleLayout';
import ReactMarkdown from 'react-markdown';

export default function PrivacyPage() {
    const { editMode, registerField, focusOnField } = useEditor();

    const { data: policy } = useQuery({
        queryKey: ['content', 'privacy'],
        queryFn: async () => {
            const response = await fetch('/api/content/load?file=content/privacy.json');
            return response.json();
        }
    });

    const makeEditable = (path: string, value: string, label: string, type: 'text' | 'textarea' = 'text') => {
        if (!editMode) return {};
        // Add prefix 'privacy.' for key mapping in VisualEditor
        const fullPath = `privacy.${path}`;

        return {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                registerField({ path: fullPath, value, label, type });
                focusOnField(fullPath);
            },
            'data-editable': 'true',
            style: {
                cursor: 'pointer',
                outline: '2px dashed rgba(16, 185, 129, 0.4)',
                outlineOffset: '2px',
                borderRadius: '4px',
            },
        };
    };

    if (!policy) {
        return (
            <ModuleLayout>
                <div className="p-20 text-center text-white pt-32">Loading...</div>
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <main className="bg-black min-h-screen text-white pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1
                        className="text-4xl font-bold mb-8 text-emerald-500"
                        {...makeEditable('title', policy.title, 'Page Title', 'text')}
                    >
                        {policy.title}
                    </h1>

                    <div
                        className="prose prose-invert prose-lg max-w-none"
                        {...makeEditable('content', policy.content, 'Content (HTML/Markdown)', 'textarea')}
                    >
                        <div dangerouslySetInnerHTML={{ __html: policy.content }} />
                    </div>
                </div>
            </main>
        </ModuleLayout>
    );
}
