// Custom React hooks for the TMF React Client

import { useEffect, useRef, useCallback, useState } from 'react';
import { ConnectionStatus, KeyboardShortcut } from '../types';
import { crudService } from '../services/crud.service';

/**
 * Hook for managing server connection status
 */
export function useConnectionStatus(checkInterval: number = 5000) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Checking connection...',
  });

  const checkConnection = useCallback(async () => {
    const status = await crudService.checkConnection();
    if (status) {
      setConnectionStatus({
        connected: true,
        message: 'Connected to CRUD server',
        lastChecked: new Date(),
      });
    } else {
      setConnectionStatus({
        connected: false,
        message: 'Server not available',
        lastChecked: new Date(),
      });
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, checkInterval);
    return () => clearInterval(interval);
  }, [checkConnection, checkInterval]);

  return { connectionStatus, checkConnection };
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = event.key === shortcut.key || event.code === shortcut.key;
        const matchesCtrl = shortcut.ctrlKey ? event.ctrlKey : true;
        const matchesShift = shortcut.shiftKey ? event.shiftKey : true;
        const matchesAlt = shortcut.altKey ? event.altKey : true;

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing focus on property inputs
 */
export function useFocusManagement(shouldFocus: boolean) {
  const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

  const setInputRef = useCallback((index: number) => {
    return (el: HTMLInputElement | HTMLSelectElement | null) => {
      inputRefs.current[index] = el;
    };
  }, []);

  const focusFirstInput = useCallback(() => {
    const firstInput = inputRefs.current.find((input) => input !== null);
    if (firstInput && !firstInput.hasAttribute('data-focused')) {
      setTimeout(() => {
        firstInput.focus();
        firstInput.setAttribute('data-focused', 'true');
      }, 100);
    }
  }, []);

  const clearFocusAttributes = useCallback(() => {
    inputRefs.current.forEach((input) => {
      if (input) {
        input.removeAttribute('data-focused');
      }
    });
  }, []);

  useEffect(() => {
    if (shouldFocus) {
      focusFirstInput();
    }
  }, [shouldFocus, focusFirstInput]);

  return { setInputRef, clearFocusAttributes, inputRefs };
}

/**
 * Hook for auto-saving dirty instances
 */
export function useAutoSave(
  instances: any[],
  saveFunction: () => Promise<void>,
  enabled: boolean = false,
  delay: number = 30000
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasDirtyInstances = useCallback(() => {
    return instances.some((inst) => inst.isDirty || inst.isNew);
  }, [instances]);

  useEffect(() => {
    if (!enabled || !hasDirtyInstances()) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveFunction();
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [instances, saveFunction, enabled, delay, hasDirtyInstances]);

  return { lastSaved };
}

/**
 * Hook for managing dialog state
 */
export function useDialog<T = any>(initialState?: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogData, setDialogData] = useState<T | undefined>(initialState);

  const openDialog = useCallback((data?: T) => {
    setDialogData(data);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setDialogData(undefined), 300); // Clear after animation
  }, []);

  return {
    isOpen,
    dialogData,
    openDialog,
    closeDialog,
    setDialogData,
  };
}

/**
 * Hook for tracking unsaved changes
 */
export function useUnsavedChanges(hasChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);
}

/**
 * Hook for search/filter functionality
 */
export function useSearch<T>(
  items: T[],
  searchKeys: (keyof T)[],
  searchTerm: string
): T[] {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      });
    });

    setFilteredItems(filtered);
  }, [items, searchKeys, searchTerm]);

  return filteredItems;
}

/**
 * Hook for managing local storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook for clipboard operations
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  const readFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  }, []);

  return { copyToClipboard, readFromClipboard, copied };
}