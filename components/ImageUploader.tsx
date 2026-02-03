'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

export default function ImageUploader({ value, onChange, label = '이미지 업로드', onUploadStart, onUploadEnd }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = async (file: File) => {
        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드 가능합니다.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error('파일 크기는 10MB 이하여야 합니다.');
            return;
        }

        setUploading(true);
        onUploadStart?.(); // Notify start
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            onChange(data.url);
            toast.success('이미지가 최적화되어 업로드되었습니다!');
        } catch (error) {
            console.error(error);
            toast.error('업로드 실패');
        } finally {
            setUploading(false);
            onUploadEnd?.(); // Notify end
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} (자동 WebP 변환 & 최적화)
            </label>

            {value ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={() => onChange('')}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            type="button"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept="image/*"
                        disabled={uploading}
                    />

                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        {uploading ? (
                            <>
                                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                                <span className="text-sm font-medium text-emerald-600">최적화 처리 중...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-2 text-gray-400" />
                                <span className="text-sm font-medium">클릭하거나 파일을 여기로 드래그하세요</span>
                                <span className="text-xs text-gray-400">JPG, PNG, WebP (최대 10MB)</span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
