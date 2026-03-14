import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ResearchProvider } from '../../../contexts/ResearchContext';
import { useGuidedPalette } from './useGuidedPalette';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AuthProvider, null, React.createElement(ResearchProvider, null, children));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useGuidedPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('inicializa con fase inspiration-menu y sin colores', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });
    expect(result.current.phase).toBe('inspiration-menu');
    expect(result.current.colors).toEqual([]);
    expect(result.current.colorCount).toBe(4);
  });

  it('goToPhase cambia la fase correctamente', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });

    act(() => {
      result.current.goToPhase('save');
    });
    expect(result.current.phase).toBe('save');

    act(() => {
      result.current.goToPhase('analysis');
    });
    expect(result.current.phase).toBe('analysis');
  });

  it('handleInspirationComplete establece colores y avanza a refinement', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });
    const newColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];

    act(() => {
      result.current.handleInspirationComplete(newColors);
    });

    expect(result.current.phase).toBe('refinement');
    expect(result.current.colors).toHaveLength(4);
    expect(result.current.colors.map((c) => c.hex)).toEqual(newColors);
    expect(result.current.colors.every((c) => c.id && typeof c.id === 'string')).toBe(true);
  });

  it('updateColor actualiza el hex del color indicado', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });

    act(() => {
      result.current.handleInspirationComplete(['#ff0000', '#00ff00']);
    });

    const idToUpdate = result.current.colors[0].id;

    act(() => {
      result.current.updateColor(idToUpdate, '#ff00ff');
    });

    const updated = result.current.colors.find((c) => c.id === idToUpdate);
    expect(updated?.hex).toBe('#ff00ff');
  });

  it('undo y redo pueden invocarse sin error', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });

    act(() => {
      result.current.handleInspirationComplete(['#ff0000', '#00ff00']);
    });
    act(() => {
      result.current.updateColor(result.current.colors[0].id, '#ffffff');
    });

    expect(() => act(() => result.current.undo())).not.toThrow();
    expect(() => act(() => result.current.redo())).not.toThrow();
  });

  it('addColor añade un nuevo color hasta el límite', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });

    act(() => {
      result.current.handleInspirationComplete(['#ff0000', '#00ff00']);
    });
    expect(result.current.colors).toHaveLength(2);

    act(() => {
      result.current.addColor();
    });
    expect(result.current.colors).toHaveLength(3);

    act(() => {
      result.current.addColor();
    });
    expect(result.current.colors).toHaveLength(4);
  });

  it('removeColorAt reduce la paleta (mínimo 2)', () => {
    const { result } = renderHook(() => useGuidedPalette(), { wrapper });

    act(() => {
      result.current.handleInspirationComplete(['#ff0000', '#00ff00', '#0000ff']);
    });
    expect(result.current.colors).toHaveLength(3);

    act(() => {
      result.current.removeColorAt(1);
    });
    expect(result.current.colors).toHaveLength(2);

    act(() => {
      result.current.removeColorAt(0);
    });
    expect(result.current.colors).toHaveLength(2); // No baja de 2
  });
});
