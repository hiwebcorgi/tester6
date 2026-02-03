import { useEditor } from '@/app/EditorProvider';
import React from 'react';

export const useMakeEditable = () => {
    const { editMode, registerField, focusOnField } = useEditor();

    const makeEditable = (path: string, value: string, label: string, type: 'text' | 'textarea' | 'richtext' | 'select' | 'image' = 'text', options?: { label: string; value: string }[]) => {
        if (!editMode) return {};

        return {
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                registerField({ path, value, label, type, options });
                focusOnField(path);
            },
            'data-editable': 'true',
            'data-field-path': path,
            style: {
                cursor: 'pointer',
                outline: '2px dashed rgba(16, 185, 129, 0.4)',
                outlineOffset: '2px',
                borderRadius: '4px',
                transition: 'all 0.2s',
            } as React.CSSProperties,
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.outline = '2px solid rgb(16, 185, 129)';
                target.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                const target = e.currentTarget as HTMLElement;
                target.style.outline = '2px dashed rgba(16, 185, 129, 0.4)';
                target.style.backgroundColor = 'transparent';
            },
            title: `클릭하여 "${label}" 편집`,
        };
    };

    return { makeEditable };
};
