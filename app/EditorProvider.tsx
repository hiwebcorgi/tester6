'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface EditableField {
  path: string;
  type: 'text' | 'textarea' | 'richtext' | 'select' | 'image';
  value: string;
  label: string;
  options?: { label: string; value: string }[];
}

interface FieldEdit {
  original: string;
  current: string;
  field: EditableField;
}

interface EditorContextType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  isAuthenticated: boolean;
  recheckAuth: () => Promise<void>;
  // Field registration
  registeredFields: EditableField[];
  registerField: (field: EditableField) => void;
  unregisterAllFields: () => void;
  // Focus management
  focusedFieldPath: string | null;
  focusOnField: (path: string) => void;
  // Edit management
  updateFieldValue: (path: string, value: string) => void;
  getFieldValue: (path: string) => string;
  hasUnsavedChanges: boolean;
  getAllChanges: () => Map<string, string>;
  clearAllChanges: () => void;
  getFieldEdit: (path: string) => FieldEdit | undefined;
  // Legacy support (for transition)
  currentField: EditableField | null;
  openEditor: (field: EditableField) => void;
  closeEditor: () => void;
  currentLanguage: string;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children, lang = 'ko' }: { children: ReactNode, lang?: string }) {
  const [editMode, setEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // All registered editable fields
  const [registeredFields, setRegisteredFields] = useState<EditableField[]>([]);

  // Map of path -> FieldEdit (tracks original and current values)
  const [fieldEdits, setFieldEdits] = useState<Map<string, FieldEdit>>(new Map());

  // Currently focused field path
  const [focusedFieldPath, setFocusedFieldPath] = useState<string | null>(null);

  // Legacy: current field for backwards compatibility
  const [currentField, setCurrentField] = useState<EditableField | null>(null);

  // Check authentication function
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin-auth', {
        credentials: 'include'
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication on mount
    checkAuth();

    // Listen for custom login event
    const handleLoginEvent = () => {
      checkAuth();
    };

    window.addEventListener('admin-login-success', handleLoginEvent);
    return () => window.removeEventListener('admin-login-success', handleLoginEvent);
  }, [checkAuth]);

  // Clear all state when exiting edit mode
  useEffect(() => {
    if (!editMode) {
      setRegisteredFields([]);
      setFieldEdits(new Map());
      setFocusedFieldPath(null);
      setCurrentField(null);
    }
  }, [editMode]);

  // Register a field for editing
  const registerField = useCallback((field: EditableField) => {
    setRegisteredFields(prev => {
      // Avoid duplicates
      const exists = prev.some(f => f.path === field.path);
      if (exists) {
        // Update existing field's value
        return prev.map(f => f.path === field.path ? field : f);
      }
      return [...prev, field];
    });

    // Initialize field edit with original value
    setFieldEdits(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(field.path)) {
        newMap.set(field.path, {
          original: field.value,
          current: field.value,
          field: field
        });
      }
      return newMap;
    });
  }, []);

  // Unregister all fields
  const unregisterAllFields = useCallback(() => {
    setRegisteredFields([]);
    setFieldEdits(new Map());
  }, []);

  // Focus on a specific field (scrolls sidebar to it)
  const focusOnField = useCallback((path: string) => {
    setFocusedFieldPath(path);
  }, []);

  // Update a field's value
  const updateFieldValue = useCallback((path: string, value: string) => {
    setFieldEdits(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(path);
      if (existing) {
        newMap.set(path, {
          ...existing,
          current: value
        });
      }
      return newMap;
    });
  }, []);

  // Get current value of a field
  const getFieldValue = useCallback((path: string): string => {
    const edit = fieldEdits.get(path);
    return edit?.current ?? '';
  }, [fieldEdits]);

  // Get a specific field edit
  const getFieldEdit = useCallback((path: string): FieldEdit | undefined => {
    return fieldEdits.get(path);
  }, [fieldEdits]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = Array.from(fieldEdits.values()).some(
    edit => edit.original !== edit.current
  );

  // Get all changes (only fields that were modified)
  const getAllChanges = useCallback((): Map<string, string> => {
    const changes = new Map<string, string>();
    fieldEdits.forEach((edit, path) => {
      if (edit.original !== edit.current) {
        changes.set(path, edit.current);
      }
    });
    return changes;
  }, [fieldEdits]);

  // Clear all changes (reset to original values)
  const clearAllChanges = useCallback(() => {
    setFieldEdits(prev => {
      const newMap = new Map<string, FieldEdit>();
      prev.forEach((edit, path) => {
        newMap.set(path, {
          ...edit,
          current: edit.original
        });
      });
      return newMap;
    });
  }, []);

  // Legacy: open editor (sets focus and current field)
  const openEditor = useCallback((field: EditableField) => {
    registerField(field);
    setFocusedFieldPath(field.path);
    setCurrentField(field);
  }, [registerField]);

  // Legacy: close editor
  const closeEditor = useCallback(() => {
    setCurrentField(null);
    setFocusedFieldPath(null);
  }, []);

  const contextValue: EditorContextType = {
    editMode,
    setEditMode,
    isAuthenticated,
    recheckAuth: checkAuth,
    registeredFields,
    registerField,
    unregisterAllFields,
    focusedFieldPath,
    focusOnField,
    updateFieldValue,
    getFieldValue,
    hasUnsavedChanges,
    getAllChanges,
    clearAllChanges,
    getFieldEdit,
    currentField,
    openEditor,
    closeEditor,
    currentLanguage: lang,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
