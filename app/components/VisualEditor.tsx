'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor } from '../EditorProvider';
import toast from 'react-hot-toast';
import ModuleManager from './ModuleManager';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImageUploader from '@/components/ImageUploader';

export default function VisualEditor() {
  const {
    editMode,
    setEditMode,
    isAuthenticated,
    registeredFields,
    focusedFieldPath,
    focusOnField,
    updateFieldValue,
    getFieldValue,
    hasUnsavedChanges,
    getAllChanges,
    clearAllChanges,
    getFieldEdit,
    currentLanguage,
  } = useEditor();

  // const [saving, setSaving] = useState(false); // Replaced by mutation state
  // const [saving, setSaving] = useState(false); // Replaced by mutation state
  const [activeTab, setActiveTab] = useState<'content' | 'modules'>('content');
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Refs for each field input (for auto-scroll)
  const fieldRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to focused field
  useEffect(() => {
    if (focusedFieldPath && activeTab === 'content') {
      const fieldElement = fieldRefs.current.get(focusedFieldPath);
      if (fieldElement && scrollContainerRef.current) {
        // 부드럽게 해당 필드로 스크롤
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 포커스 효과를 위한 하이라이트
        fieldElement.classList.add('ring-2', 'ring-emerald-500');
        setTimeout(() => {
          fieldElement.classList.remove('ring-2', 'ring-emerald-500');
        }, 1500);
      }
    }
  }, [focusedFieldPath, activeTab]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Save mutation
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (changes: Map<string, string>) => {
      // Group changes by target file
      const fileGroups: Record<string, Map<string, string>> = {
        [`content/${currentLanguage}/home.json`]: new Map(),
        [`content/${currentLanguage}/settings.json`]: new Map(),
        [`content/${currentLanguage}/privacy.json`]: new Map(),
        [`content/${currentLanguage}/terms.json`]: new Map(),
      };

      changes.forEach((value, path) => {
        if (path.startsWith('settings.')) {
          fileGroups[`content/${currentLanguage}/settings.json`].set(path.substring('settings.'.length), value);
        } else if (path.startsWith('privacy.')) {
          fileGroups[`content/${currentLanguage}/privacy.json`].set(path.substring('privacy.'.length), value);
        } else if (path.startsWith('terms.')) {
          fileGroups[`content/${currentLanguage}/terms.json`].set(path.substring('terms.'.length), value);
        } else {
          fileGroups[`content/${currentLanguage}/home.json`].set(path, value);
        }
      });

      // Process each file that has changes
      const promises = Object.entries(fileGroups)
        .filter(([_, group]) => group.size > 0)
        .map(async ([fileName, group]) => {
          // 1. Fetch current content
          const response = await fetch(`/api/github-content?file=${fileName}`);
          if (!response.ok) throw new Error(`Failed to load ${fileName}`);
          const currentData = await response.json();

          // 2. Apply changes
          group.forEach((value, path) => {
            const pathParts = path.split('.');
            let target: any = currentData;
            for (let i = 0; i < pathParts.length - 1; i++) {
              if (!target[pathParts[i]]) target[pathParts[i]] = {};
              target = target[pathParts[i]];
            }
            target[pathParts[pathParts.length - 1]] = value;
          });

          // 3. Save back
          const saveResponse = await fetch('/api/content/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              file: fileName,
              content: JSON.stringify(currentData, null, 2),
              message: `Update ${group.size} fields in ${fileName} via Visual Editor`,
            }),
          });

          if (!saveResponse.ok) throw new Error(`Failed to save ${fileName}`);
          return fileName;
        });

      return Promise.all(promises);
    },
    onSuccess: (updatedFiles) => {
      toast.success(`${getAllChanges().size}개 필드 저장 완료! 10초~3분 이내로 변경 적용됩니다`);
      clearAllChanges();
      setEditMode(false);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      setTimeout(() => window.location.reload(), 2000);
    },
    onError: (error: any) => {
      console.error('[VisualEditor] Save error:', error);
      toast.error(`저장 실패: ${error.message}`);
    }
  });

  const saving = saveMutation?.isPending || false;

  const handleSaveAll = () => {
    const changes = getAllChanges();
    if (changes.size === 0) {
      toast.success('변경사항이 없습니다');
      return;
    }
    saveMutation.mutate(changes);
  };

  // Handle exit edit mode with unsaved changes check
  const handleExitEditMode = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      setEditMode(false);
    }
  };

  // Confirm exit without saving
  const confirmExit = () => {
    clearAllChanges();
    setShowExitWarning(false);
    setEditMode(false);
  };

  // Cancel exit
  const cancelExit = () => {
    setShowExitWarning(false);
  };

  // Group fields by section
  const groupedFields = registeredFields.reduce((acc, field) => {
    const section = field.path.split('.')[0];
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, typeof registeredFields>);

  // Check if a field has been modified
  const isFieldModified = (path: string): boolean => {
    const edit = getFieldEdit(path);
    return edit ? edit.original !== edit.current : false;
  };

  return (
    <>
      {/* Edit Mode Toggle Button - Only show when authenticated */}
      {isAuthenticated && editMode !== undefined && (
        <>
          <button
            onClick={editMode ? handleExitEditMode : () => setEditMode(true)}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: editMode ? '430px' : '180px',
              zIndex: 9999,
              padding: '12px 24px',
              background: editMode
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: editMode
                ? '0 8px 16px rgba(239, 68, 68, 0.3)'
                : '0 8px 16px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
            title={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
          >
            <span>{editMode ? '🔒' : '✏️'}</span>
            <span>{editMode ? 'Exit Edit' : 'Edit Mode'}</span>
          </button>

          {/* Module Manager Button - Only show when NOT in edit mode */}
          {!editMode && (
            <button
              onClick={() => {
                setActiveTab('modules');
                setEditMode(true);
              }}
              style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 9999,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
              title="Modules"
            >
              <span>🧩</span>
              <span>Modules</span>
            </button>
          )}
        </>
      )}

      {/* Editor Sidebar - Show when in edit mode */}
      {editMode && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: '400px',
            maxWidth: '90vw',
            background: 'white',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleExitEditMode}
            style={{
              position: 'absolute',
              top: '11px',
              right: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#6b7280',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            title="닫기"
          >
            ✕
          </button>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('content')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'content' ? 'white' : '#f9fafb',
                border: 'none',
                borderBottom: activeTab === 'content' ? '2px solid #10b981' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: activeTab === 'content' ? 'bold' : 'normal',
                color: activeTab === 'content' ? '#10b981' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📝 Content ({registeredFields.length})
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'modules' ? 'white' : '#f9fafb',
                border: 'none',
                borderBottom: activeTab === 'modules' ? '2px solid #3b82f6' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: activeTab === 'modules' ? 'bold' : 'normal',
                color: activeTab === 'modules' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🧩 Modules
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'content' ? (
            <>
              {/* Header */}
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                  콘텐츠 일괄 편집
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                  페이지에서 편집할 영역을 클릭하면 여기서 수정할 수 있습니다
                </p>
                {hasUnsavedChanges && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: '#fef3c7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#92400e',
                      fontWeight: '500',
                    }}
                  >
                    ⚠️ 저장되지 않은 변경사항이 있습니다
                  </div>
                )}
              </div>

              {/* Scrollable Content Area */}
              <div
                ref={scrollContainerRef}
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '16px 24px',
                }}
              >
                {registeredFields.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#9ca3af',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👆</div>
                    <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
                      페이지에서 <strong style={{ color: '#10b981' }}>초록색 점선</strong>으로
                      표시된 영역을 클릭하세요
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedFields).map(([section, fields]) => (
                    <div key={section} style={{ marginBottom: '24px' }}>
                      {/* Section Header */}
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#9ca3af',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '12px',
                          paddingBottom: '8px',
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        {section}
                      </div>

                      {/* Fields with conditional rendering for Logo/Title settings */}
                      {fields.map((field) => {
                        const isModified = isFieldModified(field.path);
                        const isFocused = focusedFieldPath === field.path;
                        const currentValue = getFieldValue(field.path);

                        // Conditional Visibility Logic for Logo Settings
                        if (field.path === 'settings.logo') {
                          const type = getFieldValue('settings.logoType');
                          if (type !== 'text') return null;
                        }
                        if (field.path === 'settings.siteTitle') {
                          const type = getFieldValue('settings.logoType');
                          if (type !== 'text' && type !== 'image-text') return null;
                        }
                        if (field.path === 'settings.logoImage') {
                          const type = getFieldValue('settings.logoType');
                          if (type !== 'image' && type !== 'image-text') return null;
                        }

                        return (
                          <div
                            key={field.path}
                            ref={(el) => {
                              if (el) fieldRefs.current.set(field.path, el);
                            }}
                            onClick={() => focusOnField(field.path)}
                            style={{
                              marginBottom: '16px',
                              padding: '12px',
                              borderRadius: '8px',
                              background: isFocused ? '#ecfdf5' : isModified ? '#fffbeb' : '#f9fafb',
                              border: isFocused
                                ? '2px solid #10b981'
                                : isModified
                                  ? '2px solid #f59e0b'
                                  : '1px solid #e5e7eb',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                              }}
                            >
                              <label
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#374151',
                                }}
                              >
                                {field.label}
                              </label>
                              {isModified && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    color: '#f59e0b',
                                    background: '#fef3c7',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  수정됨
                                </span>
                              )}
                            </div>

                            {field.type === 'text' ? (
                              <input
                                type="text"
                                value={currentValue}
                                onChange={(e) => updateFieldValue(field.path, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.2s',
                                  background: 'white',
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = '#10b981';
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                value={currentValue}
                                onChange={(e) => updateFieldValue(field.path, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  background: 'white',
                                  cursor: 'pointer',
                                }}
                              >
                                {field.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'image' ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <ImageUploader
                                  value={currentValue}
                                  onChange={(url) => updateFieldValue(field.path, url)}
                                  label={field.label}
                                />
                              </div>
                            ) : (
                              <textarea
                                value={currentValue}
                                onChange={(e) => updateFieldValue(field.path, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                rows={field.type === 'textarea' ? 3 : 5}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.2s',
                                  resize: 'vertical',
                                  fontFamily: 'inherit',
                                  background: 'white',
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = '#10b981';
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}

                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px' }}>
                  💡 저장 후 2-3분 뒤에 변경사항이 반영됩니다.
                </p>
              </div>

              {/* Fixed Footer with Save Button */}
              <div
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  display: 'flex',
                  gap: '12px',
                }}
              >
                <button
                  onClick={handleSaveAll}
                  disabled={saving || !hasUnsavedChanges}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background:
                      saving || !hasUnsavedChanges
                        ? '#9ca3af'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: saving || !hasUnsavedChanges ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    if (!saving && hasUnsavedChanges) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {saving ? (
                    <>💾 저장 중...</>
                  ) : (
                    <>💾 모든 변경사항 저장</>
                  )}
                </button>

                <button
                  onClick={() => clearAllChanges()}
                  disabled={saving || !hasUnsavedChanges}
                  style={{
                    padding: '14px 20px',
                    background: '#fff',
                    color: hasUnsavedChanges ? '#374151' : '#9ca3af',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: saving || !hasUnsavedChanges ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    if (!saving && hasUnsavedChanges) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  ↩️ 초기화
                </button>
              </div>
            </>
          ) : activeTab === 'modules' ? (
            <ModuleManager />
          ) : null}
        </div>
      )}

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <>
          <div
            onClick={cancelExit}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10100,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              zIndex: 10101,
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              저장하지 않은 변경사항이 있습니다
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#6b7280' }}>
              편집 모드를 종료하면 변경사항이 사라집니다. 계속하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={confirmExit}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                저장 안 함
              </button>
              <button
                onClick={cancelExit}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                계속 편집
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
