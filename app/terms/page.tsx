'use client';
import { useEditor } from '../EditorProvider';
import { useQuery } from '@tanstack/react-query';
import ModuleLayout from '../components/ModuleLayout';

export default function TermsPage() {
    const { editMode, registerField, focusOnField } = useEditor();

    const { data: terms } = useQuery({
        queryKey: ['content', 'terms'],
        queryFn: async () => {
            const response = await fetch('/api/content/load?file=content/terms.json');
            return response.json();
        }
    });

    const makeEditable = (path: string, value: string, label: string, type: 'text' | 'textarea' = 'text') => {
        if (!editMode) return {};
        // Add prefix 'terms.' for key mapping in VisualEditor
        const fullPath = `terms.${path}`;

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

    if (!terms) {
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
                        {...makeEditable('title', terms.title, 'Page Title', 'text')}
                    >
                        {terms.title}
                    </h1>

                    <div
                        className="prose prose-invert prose-lg max-w-none"
                        {...makeEditable('content', terms.content, 'Content (HTML/Markdown)', 'textarea')}
                    >
                        <div dangerouslySetInnerHTML={{ __html: terms.content }} />
                    </div>
                </div>
            </main>
        </ModuleLayout>
    );
}
