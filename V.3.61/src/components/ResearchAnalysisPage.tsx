import { useState, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, BarChart3, Table2, LayoutGrid, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseConfig } from '../lib/env';

/**
 * Análisis de datos para investigación (admin).
 * Estructura: menú lateral (Sociodemográficas | Paletas) → toolbar (Previsualizar, Excel, Vista con gráficos, ordenar)
 * → contenido: sin gráficos = tabla; con gráficos = tabla superior (altura fija, scroll) + panel análisis (altura fija, pestañas Resumen/Edad/Género/Área/UPV/Cruces, scroll interno).
 */

export interface PaletteRow {
  id: string;
  user_id: string;
  name: string;
  colors: string[];
  color_1: string | null;
  color_2: string | null;
  color_3: string | null;
  color_4: string | null;
  color_5: string | null;
  color_6: string | null;
  color_7: string | null;
  color_8: string | null;
  created_at: string;
}

export interface DemographicsRow {
  user_id: string;
  /** Código numérico asignado (1, 2, 3, ...) desde research_participant_codes. */
  code: number | null;
  age_range: string | null;
  gender: string | null;
  design_career: string | null;
  is_upv_student: boolean | null;
  consented_at: string;
}

interface ResearchAnalysisPageProps {
  onBack: () => void;
}

type SectionId = 'demographics' | 'palettes';

const SECTIONS: { id: SectionId; label: string; description: string }[] = [
  { id: 'demographics', label: 'Sociodemográficas', description: 'Edad, género, área, estudiante UPV' },
  { id: 'palettes', label: 'Paletas guardadas', description: 'Nombre, colores, fecha' },
];

const GENDER_LABELS: Record<string, string> = {
  female: 'Mujer',
  male: 'Hombre',
  non_binary: 'No binario',
  other: 'Otro',
};

const DESIGN_CAREER_LABELS: Record<string, string> = {
  graphic_design: 'Diseño gráfico',
  product_design: 'Diseño de producto',
  interior_design: 'Diseño de interiores',
  fashion_design: 'Diseño de moda',
  ux_ui: 'Diseño UX/UI',
  architecture: 'Arquitectura',
  fine_arts: 'Bellas artes',
  communication: 'Comunicación / Audiovisual',
  marketing: 'Marketing',
  other_design: 'Otra (diseño)',
  other: 'Otra (no diseño)',
};

// --- Análisis sociodemográficas: constantes y layout ---
/** Orden lógico de rangos de edad (no por frecuencia). */
const AGE_RANGE_ORDER = ['18-25', '26-35', '36-45', '46-55', '55+'];
const UPV_ORDER = ['Sí', 'No', 'Sin indicar'] as const;
/** Altura tabla superior en vista con gráficos (~3 filas). Panel análisis fijo para scroll interno. */
const TABLE_VIEW_HEIGHT_REM = '10rem';
const ANALYSIS_PANEL_HEIGHT_REM = '24rem';

type DemographicsAnalysisTab = 'summary' | 'age' | 'gender' | 'career' | 'upv' | 'cross';

const DEMOGRAPHICS_ANALYSIS_TABS: { id: DemographicsAnalysisTab; label: string }[] = [
  { id: 'summary', label: 'Resumen' },
  { id: 'age', label: 'Edad' },
  { id: 'gender', label: 'Género' },
  { id: 'career', label: 'Área' },
  { id: 'upv', label: 'UPV' },
  { id: 'cross', label: 'Cruces' },
];

interface FreqRow {
  label: string;
  n: number;
  pct: number;
}

function getFrequencyCounts(
  data: DemographicsRow[],
  getKey: (r: DemographicsRow) => string,
  order?: string[]
): FreqRow[] {
  const m: Record<string, number> = {};
  data.forEach((r) => {
    const k = getKey(r) || 'Sin indicar';
    m[k] = (m[k] ?? 0) + 1;
  });
  const total = data.length;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  if (order && order.length) {
    const ordered = order.filter((o) => m[o] != null).map((label) => ({ label, n: m[label], pct: pct(m[label]) }));
    const rest = Object.entries(m)
      .filter(([label]) => !order.includes(label))
      .map(([label, n]) => ({ label, n, pct: pct(n) }));
    return [...ordered, ...rest];
  }
  return Object.entries(m)
    .map(([label, n]) => ({ label, n, pct: pct(n) }))
    .sort((a, b) => b.n - a.n);
}

function labelGender(raw: string): string {
  return (raw && GENDER_LABELS[raw]) || raw || 'Sin indicar';
}

function labelCareer(raw: string): string {
  return (raw && DESIGN_CAREER_LABELS[raw]) || raw || 'Sin indicar';
}

export type DemographicsDisplayRow = {
  codigo_id: string;
  user_id: string;
  age_range: string;
  gender: string;
  design_career: string;
  is_upv_student: string;
  consented_date: string;
  consented_time: string;
};

function formatBoolean(b: boolean | null): string {
  if (b === true) return 'Sí';
  if (b === false) return 'No';
  return '—';
}

function formatConsentDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return '—';
  }
}

function formatConsentTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toTimeString().slice(0, 8);
  } catch {
    return '—';
  }
}

function formatDemographicsForDisplay(rows: DemographicsRow[]): DemographicsDisplayRow[] {
  return rows.map((r) => ({
    codigo_id: r.code != null ? String(r.code) : '—',
    user_id: r.user_id,
    age_range: r.age_range?.trim() || '—',
    gender: (r.gender && GENDER_LABELS[r.gender]) || r.gender || '—',
    design_career: (r.design_career && DESIGN_CAREER_LABELS[r.design_career]) || r.design_career || '—',
    is_upv_student: formatBoolean(r.is_upv_student),
    consented_date: formatConsentDate(r.consented_at),
    consented_time: formatConsentTime(r.consented_at),
  }));
}

const DEMOGRAPHICS_COLUMN_DEFS: { key: keyof DemographicsDisplayRow; label: string; optional?: boolean }[] = [
  { key: 'codigo_id', label: 'Código ID' },
  { key: 'user_id', label: 'User ID', optional: true },
  { key: 'age_range', label: 'Edad' },
  { key: 'gender', label: 'Género' },
  { key: 'design_career', label: 'Área diseño' },
  { key: 'is_upv_student', label: 'Estudiante UPV' },
  { key: 'consented_date', label: 'Fecha' },
  { key: 'consented_time', label: 'Hora' },
];

const PALETTES_COLUMNS: { key: keyof PaletteRow; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'user_id', label: 'User ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'color_1', label: 'Color 1' },
  { key: 'color_2', label: 'Color 2' },
  { key: 'created_at', label: 'Creado' },
];

function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  columnKey: keyof T | string,
  order: 'asc' | 'desc'
): T[] {
  if (rows.length === 0) return rows;
  const key = columnKey as keyof T;
  return [...rows].sort((a, b) => {
    const va = a[key] != null ? String(a[key]) : '';
    const vb = b[key] != null ? String(b[key]) : '';
    const cmp = va.localeCompare(vb, undefined, { numeric: true });
    return order === 'asc' ? cmp : -cmp;
  });
}

function formatResearchError(msg: string): string {
  return msg.includes('403') || msg.includes('Forbidden')
    ? 'No tienes permiso. Configura la allowlist en la Edge Function.'
    : `Error: ${msg}`;
}

function useResearchFetch<T>(fnName: string) {
  const { session } = useAuth();
  const config = getSupabaseConfig();
  return useCallback(
    async (): Promise<T> => {
      if (!config?.url || !config?.anonKey || !session?.access_token) {
        throw new Error('Sesión o URL de Supabase no disponible');
      }
      const fnUrl = `${config.url.replace(/\/$/, '')}/functions/v1/${fnName}`;
      const res = await fetch(fnUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.anonKey}`,
          'X-User-Token': session.access_token,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      const data = await res.json();
      return data as T;
    },
    [fnName, config?.url, config?.anonKey, session?.access_token]
  );
}

function PreviewTable<T extends Record<string, unknown>>({
  rows,
  columns,
  rowKey,
  className,
  embedded,
}: {
  rows: T[];
  columns: { key: keyof T; label: string }[];
  rowKey?: keyof T;
  className?: string;
  /** Si true, no envuelve en div con overflow (para usar dentro de un contenedor con scroll y cabecera fija). */
  embedded?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4 px-2">No hay filas para mostrar.</p>
    );
  }
  const table = (
    <table className="w-full min-w-max text-sm text-left">
      <thead className="bg-gray-800/80 text-gray-300 sticky top-0 z-10">
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-3 py-2 font-medium whitespace-nowrap">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {rows.map((row, i) => (
          <tr key={rowKey && row[rowKey] != null ? String(row[rowKey]) : i} className="hover:bg-gray-800/50">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-3 py-2 text-gray-300 whitespace-nowrap max-w-[200px] truncate">
                {row[col.key] != null ? String(row[col.key]) : '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  if (embedded) return <div className={className ?? ''}>{table}</div>;
  return (
    <div className={`overflow-auto rounded-lg border border-gray-700 bg-gray-900/30 ${className ?? ''}`}>
      {table}
    </div>
  );
}

/** Tabla de frecuencias: categoría, n, % (compacta). dense=true para resumen (menos alto). */
function FrequencyTable({ rows, title, dense }: { rows: FreqRow[]; title?: string; dense?: boolean }) {
  if (rows.length === 0) return null;
  const cellPy = dense ? 'py-0' : 'py-0.5';
  const textSize = dense ? 'text-xs' : 'text-sm';
  return (
    <div className={dense ? 'space-y-0' : 'space-y-0.5'}>
      {title && <h4 className="text-xs font-medium text-gray-400">{title}</h4>}
      <table className={`w-full ${textSize}`}>
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-700">
            <th className={`${cellPy} pr-2`}>Categoría</th>
            <th className={`${cellPy} w-10 text-right`}>n</th>
            <th className={`${cellPy} w-12 text-right`}>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, n, pct }) => (
            <tr key={label} className="border-b border-gray-800/50">
              <td className={`${cellPy} pr-2 text-gray-300`}>{label}</td>
              <td className={`${cellPy} text-right text-gray-400`}>{n}</td>
              <td className={`${cellPy} text-right text-gray-400`}>{pct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Colores para segmentos del donut (evitar solo indigo). */
const DONUT_COLORS = [
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
];

/** Gráfico donut (porcentajes) con leyenda. */
function FreqDonutChart({ rows }: { rows: FreqRow[] }) {
  const total = rows.reduce((s, r) => s + r.pct, 0) || 100;
  const gradientStops = rows.reduce<{ deg: number; color: string }[]>((acc, r, i) => {
    const prevDeg = acc.length ? acc[acc.length - 1].deg : 0;
    acc.push({ deg: prevDeg + (r.pct / total) * 360, color: DONUT_COLORS[i % DONUT_COLORS.length] });
    return acc;
  }, []);
  const conicValue =
    gradientStops.length === 0
      ? 'gray'
      : gradientStops.map((s, i) => {
          const prev = i === 0 ? 0 : gradientStops[i - 1].deg;
          return `${s.color} ${prev}deg ${s.deg}deg`;
        }).join(', ');
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-32 h-32 rounded-full border-4 border-gray-800 shrink-0"
        style={{ background: `conic-gradient(from 0deg, ${conicValue})` }}
        aria-hidden
      />
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {rows.map(({ label, n, pct }, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="text-gray-400 truncate max-w-[100px]" title={label}>{label}</span>
            <span className="text-gray-500">{n}</span>
            <span className="text-gray-600">({pct.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Barras horizontales: ancho de la barra = % sobre el máximo (n/max*100%). */
function FreqBarChart({ rows }: { rows: FreqRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="space-y-1.5 w-full min-w-[220px] max-w-[320px]">
      {rows.map(({ label, n, pct }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-400 shrink-0 truncate" title={label}>
            {label}
          </span>
          <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden min-w-[80px]">
            <div
              className="h-full bg-indigo-500 rounded min-w-[2px] transition-all"
              style={{ width: `${(n / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-5 text-right shrink-0">{n}</span>
          <span className="text-xs text-gray-500 w-8 text-right shrink-0">{pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

/** Dos subsecciones: izquierda = barras centradas, derecha = donut centrado. */
function DemographicsUnivariateCharts({ rows, emptyMessage }: { rows: FreqRow[]; emptyMessage: string }) {
  if (rows.length === 0) return <p className="text-gray-500 text-sm py-2">{emptyMessage}</p>;
  return (
    <div className="grid grid-cols-2 gap-6 w-full py-4 min-h-[200px]">
      <div className="flex flex-col items-center justify-center border border-gray-700/50 rounded-lg bg-gray-900/20">
        <span className="text-xs text-gray-500 mb-2 mt-2">Barras</span>
        <FreqBarChart rows={rows} />
      </div>
      <div className="flex flex-col items-center justify-center border border-gray-700/50 rounded-lg bg-gray-900/20">
        <span className="text-xs text-gray-500 mb-2 mt-2">Circular</span>
        <FreqDonutChart rows={rows} />
      </div>
    </div>
  );
}

/** Edad: donut + barras, centrado. */
function DemographicsAgeChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(
    () => getFrequencyCounts(data, (r) => r.age_range?.trim() ?? '', AGE_RANGE_ORDER),
    [data]
  );
  return <DemographicsUnivariateCharts rows={rows} emptyMessage="Carga sociodemográficas para ver la distribución." />;
}

/** Género: donut + barras, centrado. */
function DemographicsGenderChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(() => {
    const raw = getFrequencyCounts(data, (r) => r.gender ?? '');
    return raw.map((r) => ({ ...r, label: labelGender(r.label) }));
  }, [data]);
  return <DemographicsUnivariateCharts rows={rows} emptyMessage="Sin datos de género." />;
}

/** Área diseño: donut + barras, centrado. */
function DemographicsCareerChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(() => {
    const raw = getFrequencyCounts(data, (r) => r.design_career ?? '');
    return raw.map((r) => ({ ...r, label: labelCareer(r.label) }));
  }, [data]);
  return <DemographicsUnivariateCharts rows={rows} emptyMessage="Sin datos de área." />;
}

/** Estudiante UPV: donut + barras, centrado. */
function DemographicsUpvChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(
    () =>
      getFrequencyCounts(data, (r) => (r.is_upv_student === true ? 'Sí' : r.is_upv_student === false ? 'No' : 'Sin indicar'), [...UPV_ORDER]),
    [data]
  );
  return <DemographicsUnivariateCharts rows={rows} emptyMessage="Sin datos." />;
}

/** Resumen de la muestra: N total + tablas en grid 2 columnas (más corto y fácil de leer). */
function SampleSummary({ data }: { data: DemographicsRow[] }) {
  const n = data.length;
  const ageRows = useMemo(() => getFrequencyCounts(data, (r) => r.age_range?.trim() ?? '', AGE_RANGE_ORDER), [data]);
  const genderRows = useMemo(() => getFrequencyCounts(data, (r) => r.gender ?? ''), [data]);
  const careerRows = useMemo(() => getFrequencyCounts(data, (r) => r.design_career ?? ''), [data]);
  const upvRows = useMemo(
    () => getFrequencyCounts(data, (r) => (r.is_upv_student === true ? 'Sí' : r.is_upv_student === false ? 'No' : 'Sin indicar'), [...UPV_ORDER]),
    [data]
  );
  if (n === 0) return <p className="text-gray-500 text-sm py-2">Carga sociodemográficas para ver el resumen.</p>;
  return (
    <div className="space-y-1.5">
      <p className="text-sm text-gray-300">
        <strong>N = {n}</strong> participantes (con consentimiento y datos en sociodemográficas).
      </p>
      <div className="grid grid-cols-2 gap-x-[4rem] gap-y-[3rem]">
        <FrequencyTable dense rows={ageRows.map((r) => ({ ...r, label: r.label }))} title="Edad (rango)" />
        <FrequencyTable dense rows={genderRows.map((r) => ({ ...r, label: labelGender(r.label) }))} title="Género" />
        <FrequencyTable dense rows={careerRows.map((r) => ({ ...r, label: labelCareer(r.label) }))} title="Área diseño" />
        <FrequencyTable dense rows={upvRows} title="Estudiante UPV" />
      </div>
    </div>
  );
}

/** Opciones de cruce bivariado. */
const CROSS_OPTIONS: { id: string; label: string; rowKey: keyof DemographicsRow; colKey: keyof DemographicsRow }[] = [
  { id: 'gender-career', label: 'Género × Área diseño', rowKey: 'gender', colKey: 'design_career' },
  { id: 'age-career', label: 'Edad × Área diseño', rowKey: 'age_range', colKey: 'design_career' },
  { id: 'upv-career', label: 'Estudiante UPV × Área diseño', rowKey: 'is_upv_student', colKey: 'design_career' },
  { id: 'gender-age', label: 'Género × Edad', rowKey: 'gender', colKey: 'age_range' },
];

function crossLabel(key: keyof DemographicsRow, value: string | boolean | null): string {
  if (key === 'is_upv_student') {
    const v = value === true || value === 'true';
    const f = value === false || value === 'false';
    return v ? 'Sí' : f ? 'No' : 'Sin indicar';
  }
  if (key === 'gender') return labelGender(String(value ?? ''));
  if (key === 'design_career') return labelCareer(String(value ?? ''));
  if (key === 'age_range') return String(value ?? '').trim() || 'Sin indicar';
  return String(value ?? '—');
}

/** Tabla cruzada: conteos por (fila, columna). */
function CrossTable({
  data,
  rowKey,
  colKey,
}: {
  data: DemographicsRow[];
  rowKey: keyof DemographicsRow;
  colKey: keyof DemographicsRow;
}) {
  const { matrix, rowLabels, colLabels } = useMemo(() => {
    const rowVals = new Map<string, number>();
    const colVals = new Map<string, number>();
    const matrixMap = new Map<string, Map<string, number>>();
    data.forEach((r) => {
      const rv = r[rowKey] != null ? String(r[rowKey]) : '';
      const cv = r[colKey] != null ? String(r[colKey]) : '';
      const rk = rv.trim() || 'Sin indicar';
      const ck = cv.trim() || 'Sin indicar';
      rowVals.set(rk, (rowVals.get(rk) ?? 0) + 1);
      colVals.set(ck, (colVals.get(ck) ?? 0) + 1);
      if (!matrixMap.has(rk)) matrixMap.set(rk, new Map());
      const rowMap = matrixMap.get(rk)!;
      rowMap.set(ck, (rowMap.get(ck) ?? 0) + 1);
    });
    const rowLabels = Array.from(rowVals.keys()).sort();
    const colLabels = Array.from(colVals.keys()).sort();
    const matrix = rowLabels.map((r) => colLabels.map((c) => matrixMap.get(r)?.get(c) ?? 0));
    return { matrix, rowLabels, colLabels };
  }, [data, rowKey, colKey]);

  if (rowLabels.length === 0 || colLabels.length === 0) {
    return <p className="text-gray-500 text-sm py-2">Sin datos para este cruce.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-2 py-1 text-left text-gray-400 font-medium">↓ Fila / Columna →</th>
            {colLabels.map((c) => (
              <th key={c} className="px-2 py-1 text-right text-gray-400 font-medium whitespace-nowrap">
                {crossLabel(colKey, c)}
              </th>
            ))}
            <th className="px-2 py-1 text-right text-gray-500 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((r, i) => {
            const rowSum = matrix[i].reduce((a, b) => a + b, 0);
            return (
              <tr key={r} className="border-t border-gray-700">
                <td className="px-2 py-1 text-gray-300 whitespace-nowrap">{crossLabel(rowKey, r)}</td>
                {matrix[i].map((n, j) => (
                  <td key={j} className="px-2 py-1 text-right text-gray-400">
                    {n}
                  </td>
                ))}
                <td className="px-2 py-1 text-right text-gray-500 font-medium">{rowSum}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-700 bg-gray-800/50">
            <td className="px-2 py-1 text-gray-500 font-medium">Total</td>
            {colLabels.map((_, j) => {
              const colSum = rowLabels.reduce((acc, _, i) => acc + matrix[i][j], 0);
              return (
                <td key={j} className="px-2 py-1 text-right text-gray-500 font-medium">
                  {colSum}
                </td>
              );
            })}
            <td className="px-2 py-1 text-right text-gray-400 font-medium">{data.length}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function ResearchAnalysisPage({ onBack }: ResearchAnalysisPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<SectionId>('demographics');
  const [splitView, setSplitView] = useState(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [demographicsAnalysisTab, setDemographicsAnalysisTab] = useState<DemographicsAnalysisTab>('summary');
  const [crossOptionId, setCrossOptionId] = useState<string>(CROSS_OPTIONS[0].id);
  const [showUserIdInTable, setShowUserIdInTable] = useState(false);

  useEffect(() => {
    setSortBy('');
  }, [section]);

  const demographicsColumns = useMemo(
    () => DEMOGRAPHICS_COLUMN_DEFS.filter((c) => !c.optional || showUserIdInTable),
    [showUserIdInTable]
  );

  const fetchPalettes = useResearchFetch<PaletteRow[]>('export-research-data');
  const fetchDemographics = useResearchFetch<DemographicsRow[]>('export-research-demographics');

  const [demographicsData, setDemographicsData] = useState<DemographicsRow[] | null>(null);
  const [demographicsLoading, setDemographicsLoading] = useState(false);
  const [palettesData, setPalettesData] = useState<PaletteRow[] | null>(null);
  const [palettesLoading, setPalettesLoading] = useState(false);

  const handlePreviewDemographics = useCallback(async () => {
    setError(null);
    setDemographicsLoading(true);
    try {
      const raw = await fetchDemographics();
      setDemographicsData(Array.isArray(raw) ? raw : []);
    } catch (e) {
      setError(formatResearchError(e instanceof Error ? e.message : String(e)));
      setDemographicsData(null);
    } finally {
      setDemographicsLoading(false);
    }
  }, [fetchDemographics]);

  const handlePreviewPalettes = useCallback(async () => {
    setError(null);
    setPalettesLoading(true);
    try {
      const raw = await fetchPalettes();
      setPalettesData(Array.isArray(raw) ? raw : []);
    } catch (e) {
      setError(formatResearchError(e instanceof Error ? e.message : String(e)));
      setPalettesData(null);
    } finally {
      setPalettesLoading(false);
    }
  }, [fetchPalettes]);

  const loadSection = useCallback(() => {
    if (section === 'demographics') handlePreviewDemographics();
    else handlePreviewPalettes();
  }, [section, handlePreviewDemographics, handlePreviewPalettes]);

  const demographicsDisplayRows = useMemo(
    () => formatDemographicsForDisplay(demographicsData ?? []),
    [demographicsData]
  );

  const currentColumns = section === 'demographics' ? demographicsColumns : PALETTES_COLUMNS;
  const validSortBy = sortBy && currentColumns.some((c) => c.key === sortBy) ? sortBy : null;

  const sortedDemographicsRows = useMemo(() => {
    if (!validSortBy || section !== 'demographics') return demographicsDisplayRows;
    return sortRows(demographicsDisplayRows, validSortBy as keyof DemographicsDisplayRow, sortOrder);
  }, [demographicsDisplayRows, validSortBy, section, sortOrder]);

  const sortedPalettesRows = useMemo(() => {
    if (!validSortBy || section !== 'palettes' || !palettesData) return palettesData ?? [];
    return sortRows(palettesData, validSortBy as keyof PaletteRow, sortOrder);
  }, [palettesData, validSortBy, section, sortOrder]);

  const downloadDemographicsExcel = useCallback(() => {
    if (!sortedDemographicsRows.length) return;
    const sheetData = sortedDemographicsRows.map((r) => ({
      'Código ID': r.codigo_id,
      'User ID': r.user_id,
      Edad: r.age_range,
      Género: r.gender,
      'Área diseño': r.design_career,
      'Estudiante UPV': r.is_upv_student,
      Fecha: r.consented_date,
      Hora: r.consented_time,
    }));
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sociodemográficas');
    XLSX.writeFile(wb, `chromatica-sociodemograficas-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [sortedDemographicsRows]);

  const downloadPalettesExcel = useCallback(() => {
    if (!sortedPalettesRows.length) return;
    const sheetData = sortedPalettesRows.map((r) => ({
      ID: r.id,
      'User ID': r.user_id,
      Nombre: r.name ?? '',
      'Color 1': r.color_1 ?? '',
      'Color 2': r.color_2 ?? '',
      'Color 3': r.color_3 ?? '',
      'Color 4': r.color_4 ?? '',
      'Color 5': r.color_5 ?? '',
      'Color 6': r.color_6 ?? '',
      'Color 7': r.color_7 ?? '',
      'Color 8': r.color_8 ?? '',
      Creado: r.created_at,
    }));
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paletas');
    XLSX.writeFile(wb, `chromatica-paletas-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [sortedPalettesRows]);

  const currentData = section === 'demographics' ? demographicsData : palettesData;
  const currentLoading = section === 'demographics' ? demographicsLoading : palettesLoading;
  const currentSection = SECTIONS.find((s) => s.id === section)!;
  const canDownload =
    (section === 'demographics' && demographicsData && demographicsData.length > 0) ||
    (section === 'palettes' && palettesData && palettesData.length > 0);

  return (
    <div className="app-fullscreen bg-[#0a0a0f] text-gray-100 flex flex-col">
      <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
            aria-label="Volver a la app"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Análisis de datos para investigación</h1>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Menú lateral */}
        <aside className="w-52 shrink-0 border-r border-gray-700/50 bg-gray-900/40 flex flex-col py-4">
          <nav className="px-2 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                  section === s.id
                    ? 'bg-indigo-600/80 text-white'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                }`}
              >
                {s.id === 'demographics' ? (
                  <BarChart3 className="w-4 h-4 shrink-0" />
                ) : (
                  <Table2 className="w-4 h-4 shrink-0" />
                )}
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido: toolbar + excel (+ gráficos si split) */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 px-4 py-4">
          <p className="text-gray-400 text-sm mb-3">{currentSection.description}</p>

          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={loadSection}
              disabled={currentLoading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {currentLoading ? 'Cargando…' : 'Previsualizar'}
            </button>
            <button
              type="button"
              onClick={section === 'demographics' ? downloadDemographicsExcel : downloadPalettesExcel}
              disabled={!canDownload}
              className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 disabled:opacity-50 text-gray-300 text-sm transition-colors"
            >
              Descargar Excel
            </button>
            <label className="flex items-center gap-2 ml-4 cursor-pointer text-sm text-gray-400 hover:text-gray-300">
              <input
                type="checkbox"
                checked={splitView}
                onChange={(e) => setSplitView(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
              />
              <LayoutGrid className="w-4 h-4" />
              Vista con gráficos
            </label>
            {section === 'demographics' && (
              <label className="flex items-center gap-2 ml-4 cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                <input
                  type="checkbox"
                  checked={showUserIdInTable}
                  onChange={(e) => setShowUserIdInTable(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                />
                Mostrar User ID en tabla
              </label>
            )}

            {currentData != null && currentData.length > 0 && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-600">
                <ArrowUpDown className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-500 shrink-0">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm px-2 py-1.5 min-w-[140px]"
                  aria-label="Columna para ordenar"
                >
                  <option value="">Sin orden</option>
                  {currentColumns.map((col) => (
                    <option key={String(col.key)} value={String(col.key)}>
                      {col.label}
                    </option>
                  ))}
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  disabled={!validSortBy}
                  className="rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm px-2 py-1.5 disabled:opacity-50"
                  aria-label="Orden"
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>
            )}
          </div>

          <div
            className={
              splitView ? 'flex-1 min-h-0 overflow-auto flex flex-col' : 'flex-1 min-h-0 overflow-auto'
            }
          >
            {!splitView ? (
              <>
                {section === 'demographics' && demographicsData != null && (
                  <PreviewTable
                    rows={sortedDemographicsRows}
                    columns={demographicsColumns}
                    rowKey="user_id"
                    className="min-h-[200px]"
                  />
                )}
                {section === 'palettes' && palettesData != null && (
                  <PreviewTable
                    rows={sortedPalettesRows}
                    columns={PALETTES_COLUMNS}
                    rowKey="id"
                    className="min-h-[200px]"
                  />
                )}
                {currentData == null && !currentLoading && (
                  <p className="text-gray-500 text-sm py-8">Pulsa Previsualizar para cargar los datos.</p>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-0 min-h-0 shrink-0">
                {/* Sección superior: tabla fija a ~3 filas visibles, scroll interno */}
                <div className="shrink-0 flex flex-col rounded-t-lg border border-gray-700 border-b-0 overflow-hidden">
                  <div className="shrink-0 bg-gray-800/60 px-2 py-1.5 border-b border-gray-700">
                    <span className="text-xs font-medium text-gray-400">Tabla</span>
                  </div>
                  <div className="overflow-auto bg-gray-900/20" style={{ height: TABLE_VIEW_HEIGHT_REM }}>
                    {section === 'demographics' && demographicsData != null && (
                      <PreviewTable
                        rows={sortedDemographicsRows}
                        columns={demographicsColumns}
                        rowKey="user_id"
                        className="min-h-0"
                        embedded
                      />
                    )}
                    {section === 'palettes' && palettesData != null && (
                      <PreviewTable
                        rows={sortedPalettesRows}
                        columns={PALETTES_COLUMNS}
                        rowKey="id"
                        className="min-h-0"
                        embedded
                      />
                    )}
                    {currentData == null && !currentLoading && (
                      <p className="text-gray-500 text-sm py-4 px-2">Pulsa Previsualizar para cargar los datos.</p>
                    )}
                  </div>
                </div>
                {/* Sección inferior: Análisis estadístico, altura fija (misma para Resumen/Edad/Género/etc.), scroll interno */}
                <div className="shrink-0 flex flex-col rounded-b-lg border border-gray-700 overflow-hidden bg-gray-900/30" style={{ height: ANALYSIS_PANEL_HEIGHT_REM }}>
                  <div className="shrink-0 px-3 pt-2 pb-1.5 border-b border-gray-700 bg-gray-900/50">
                    <span className="text-xs font-medium text-gray-400 block mb-1.5">Análisis estadístico</span>
                    {section === 'demographics' && demographicsData && demographicsData.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {DEMOGRAPHICS_ANALYSIS_TABS.map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setDemographicsAnalysisTab(id)}
                            className={`px-2 py-1 rounded text-sm transition-colors ${
                              demographicsAnalysisTab === id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
                    {section === 'demographics' && demographicsData && demographicsData.length > 0 && (
                      <>
                        {demographicsAnalysisTab === 'summary' && <SampleSummary data={demographicsData} />}
                        {demographicsAnalysisTab === 'age' && <DemographicsAgeChart data={demographicsData} />}
                        {demographicsAnalysisTab === 'gender' && <DemographicsGenderChart data={demographicsData} />}
                        {demographicsAnalysisTab === 'career' && <DemographicsCareerChart data={demographicsData} />}
                        {demographicsAnalysisTab === 'upv' && <DemographicsUpvChart data={demographicsData} />}
                        {demographicsAnalysisTab === 'cross' && (
                          <div className="space-y-2">
                            <label className="block text-xs text-gray-500">
                              Cruce bivariado
                              <select
                                value={crossOptionId}
                                onChange={(e) => setCrossOptionId(e.target.value)}
                                className="ml-2 mt-0.5 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200 text-sm"
                              >
                                {CROSS_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <CrossTable
                              data={demographicsData}
                              rowKey={CROSS_OPTIONS.find((o) => o.id === crossOptionId)!.rowKey}
                              colKey={CROSS_OPTIONS.find((o) => o.id === crossOptionId)!.colKey}
                            />
                          </div>
                        )}
                      </>
                    )}
                    {section === 'palettes' && (
                      <p className="text-gray-500 text-sm">Gráficos de paletas (próximamente).</p>
                    )}
                    {currentData == null && (
                      <p className="text-gray-500 text-sm">Carga datos para ver gráficos.</p>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
