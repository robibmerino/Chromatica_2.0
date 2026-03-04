/**
 * Selector de color base (muestra + hex) reutilizable.
 * Misma apariencia en Armonía de color, Refinamiento y otros flujos.
 */
import * as React from 'react';

export interface BaseColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  /** Clase del contenedor (ej. para márgenes) */
  className?: string;
  /** Tamaño del swatch: 'sm' (default) | 'md' */
  size?: 'sm' | 'md';
  /** Id para accesibilidad del label */
  id?: string;
}

const swatchSizes = {
  sm: 'w-12 h-9',
  md: 'w-16 h-12',
} as const;

export function BaseColorPicker({
  value,
  onChange,
  label = 'Color',
  className = '',
  size = 'sm',
  id: idProp,
}: BaseColorPickerProps) {
  const generatedId = React.useId();
  const id = idProp ?? `base-color-picker-${generatedId}`;
  const [textValue, setTextValue] = React.useState(value.toUpperCase());

  React.useEffect(() => {
    setTextValue(value.toUpperCase());
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="text-sm text-gray-400 block mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-3 items-center">
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${swatchSizes[size]} rounded-lg cursor-pointer border-2 border-gray-600 bg-transparent shrink-0`}
          aria-label={label}
        />
        <input
          type="text"
          value={textValue}
          onChange={(e) => {
            const v = e.target.value;
            const normalized = v.startsWith('#') ? v : `#${v}`;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(normalized)) {
              setTextValue(normalized.toUpperCase());
              if (normalized.length === 7) onChange(normalized);
            }
          }}
          onBlur={() => setTextValue(value.toUpperCase())}
          className="flex-1 min-w-0 bg-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="#000000"
          aria-label={`${label} en hexadecimal`}
        />
      </div>
    </div>
  );
}
