import { useState, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, BarChart3, Table2, LayoutGrid, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseConfig } from '../lib/env';

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

/** Orden lógico de rangos de edad para análisis (no por frecuencia). */
const AGE_RANGE_ORDER = ['18-25', '26-35', '36-45', '46-55', '55+'];

type DemographicsAnalysisTab = 'summary' | 'age' | 'gender' | 'career' | 'upv' | 'cross';

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
    user_id: r.user_id,
    age_range: r.age_range?.trim() || '—',
    gender: (r.gender && GENDER_LABELS[r.gender]) || r.gender || '—',
    design_career: (r.design_career && DESIGN_CAREER_LABELS[r.design_career]) || r.design_career || '—',
    is_upv_student: formatBoolean(r.is_upv_student),
    consented_date: formatConsentDate(r.consented_at),
    consented_time: formatConsentTime(r.consented_at),
  }));
}

const DEMOGRAPHICS_COLUMNS: { key: keyof DemographicsDisplayRow; label: string }[] = [
  { key: 'user_id', label: 'User ID' },
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
}: {
  rows: T[];
  columns: { key: keyof T; label: string }[];
  rowKey?: keyof T;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4 px-2">No hay filas para mostrar.</p>
    );
  }
  return (
    <div className={`overflow-auto rounded-lg border border-gray-700 bg-gray-900/30 ${className ?? ''}`}>
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
    </div>
  );
}

/** Tabla de frecuencias: categoría, n, %. */
function FrequencyTable({ rows, title }: { rows: FreqRow[]; title?: string }) {
  if (rows.length === 0) return null;
  return (
    <div className="space-y-1">
      {title && <h4 className="text-xs font-medium text-gray-400">{title}</h4>}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-700">
            <th className="py-1 pr-2">Categoría</th>
            <th className="py-1 w-12 text-right">n</th>
            <th className="py-1 w-14 text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, n, pct }) => (
            <tr key={label} className="border-b border-gray-800/50">
              <td className="py-1 pr-2 text-gray-300">{label}</td>
              <td className="text-right text-gray-400">{n}</td>
              <td className="text-right text-gray-400">{pct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Barras horizontales a partir de FreqRow[]. */
function FreqBarChart({ rows, maxBar = 100 }: { rows: FreqRow[]; maxBar?: number }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="space-y-2">
      {rows.map(({ label, n, pct }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-28 text-xs text-gray-400 shrink-0 truncate" title={label}>
            {label}
          </span>
          <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden min-w-0">
            <div
              className="h-full bg-indigo-500 rounded min-w-[2px] transition-all"
              style={{ width: `${maxBar ? (n / max) * maxBar : pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right shrink-0">{n}</span>
          <span className="text-xs text-gray-500 w-10 text-right shrink-0">{pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

/** Edad: orden fijo + tabla n (%) + gráfico. */
function DemographicsAgeChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(
    () => getFrequencyCounts(data, (r) => r.age_range?.trim() ?? '', AGE_RANGE_ORDER),
    [data]
  );
  if (rows.length === 0) {
    return <p className="text-gray-500 text-sm py-4">Carga sociodemográficas para ver la distribución.</p>;
  }
  return (
    <div className="space-y-4">
      <FrequencyTable rows={rows} title="Rango de edad" />
      <FreqBarChart rows={rows} />
    </div>
  );
}

/** Género: frecuencias + gráfico. */
function DemographicsGenderChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(() => {
    const raw = getFrequencyCounts(data, (r) => r.gender ?? '');
    return raw.map((r) => ({ ...r, label: labelGender(r.label) }));
  }, [data]);
  if (rows.length === 0) return <p className="text-gray-500 text-sm py-4">Sin datos de género.</p>;
  return (
    <div className="space-y-4">
      <FrequencyTable rows={rows} title="Género" />
      <FreqBarChart rows={rows} />
    </div>
  );
}

/** Área diseño: frecuencias (orden por n) + gráfico. */
function DemographicsCareerChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(() => {
    const raw = getFrequencyCounts(data, (r) => r.design_career ?? '');
    return raw.map((r) => ({ ...r, label: labelCareer(r.label) }));
  }, [data]);
  if (rows.length === 0) return <p className="text-gray-500 text-sm py-4">Sin datos de área.</p>;
  return (
    <div className="space-y-4">
      <FrequencyTable rows={rows} title="Área diseño" />
      <FreqBarChart rows={rows} />
    </div>
  );
}

/** Estudiante UPV: Sí/No. */
function DemographicsUpvChart({ data }: { data: DemographicsRow[] }) {
  const rows = useMemo(
    () =>
      getFrequencyCounts(data, (r) => (r.is_upv_student === true ? 'Sí' : r.is_upv_student === false ? 'No' : 'Sin indicar'), ['Sí', 'No', 'Sin indicar']),
    [data]
  );
  if (rows.length === 0) return <p className="text-gray-500 text-sm py-4">Sin datos.</p>;
  return (
    <div className="space-y-4">
      <FrequencyTable rows={rows} title="Estudiante UPV" />
      <FreqBarChart rows={rows} />
    </div>
  );
}

/** Resumen de la muestra: N total + tabla características. */
function SampleSummary({ data }: { data: DemographicsRow[] }) {
  const n = data.length;
  const ageRows = useMemo(() => getFrequencyCounts(data, (r) => r.age_range?.trim() ?? '', AGE_RANGE_ORDER), [data]);
  const genderRows = useMemo(() => getFrequencyCounts(data, (r) => r.gender ?? ''), [data]);
  const careerRows = useMemo(() => getFrequencyCounts(data, (r) => r.design_career ?? ''), [data]);
  const upvRows = useMemo(
    () => getFrequencyCounts(data, (r) => (r.is_upv_student === true ? 'Sí' : r.is_upv_student === false ? 'No' : 'Sin indicar'), ['Sí', 'No', 'Sin indicar']),
    [data]
  );
  if (n === 0) return <p className="text-gray-500 text-sm py-4">Carga sociodemográficas para ver el resumen.</p>;
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        <strong>N = {n}</strong> participantes (con consentimiento y datos en sociodemográficas).
      </p>
      <div className="grid grid-cols-1 gap-4">
        <FrequencyTable rows={ageRows.map((r) => ({ ...r, label: r.label }))} title="Edad (rango)" />
        <FrequencyTable rows={genderRows.map((r) => ({ ...r, label: labelGender(r.label) }))} title="Género" />
        <FrequencyTable rows={careerRows.map((r) => ({ ...r, label: labelCareer(r.label) }))} title="Área diseño" />
        <FrequencyTable rows={upvRows} title="Estudiante UPV" />
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
  const { rows, cols, matrix, rowLabels, colLabels } = useMemo(() => {
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
    return { rows: rowLabels, cols: colLabels, matrix, rowLabels, colLabels };
  }, [data, rowKey, colKey]);

  if (rows.length === 0 || cols.length === 0) {
    return <p className="text-gray-500 text-sm py-4">Sin datos para este cruce.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-2 py-2 text-left text-gray-400 font-medium">↓ Fila / Columna →</th>
            {colLabels.map((c) => (
              <th key={c} className="px-2 py-2 text-right text-gray-400 font-medium whitespace-nowrap">
                {crossLabel(colKey, c)}
              </th>
            ))}
            <th className="px-2 py-2 text-right text-gray-500 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((r, i) => {
            const rowSum = matrix[i].reduce((a, b) => a + b, 0);
            return (
              <tr key={r} className="border-t border-gray-700">
                <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap">{crossLabel(rowKey, r)}</td>
                {matrix[i].map((n, j) => (
                  <td key={j} className="px-2 py-1.5 text-right text-gray-400">
                    {n}
                  </td>
                ))}
                <td className="px-2 py-1.5 text-right text-gray-500 font-medium">{rowSum}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-700 bg-gray-800/50">
            <td className="px-2 py-1.5 text-gray-500 font-medium">Total</td>
            {colLabels.map((_, j) => {
              const colSum = rowLabels.reduce((acc, _, i) => acc + matrix[i][j], 0);
              return (
                <td key={j} className="px-2 py-1.5 text-right text-gray-500 font-medium">
                  {colSum}
                </td>
              );
            })}
            <td className="px-2 py-1.5 text-right text-gray-400 font-medium">{data.length}</td>
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

  useEffect(() => {
    setSortBy('');
  }, [section]);

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

  const currentColumns = section === 'demographics' ? DEMOGRAPHICS_COLUMNS : PALETTES_COLUMNS;
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
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col">
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

          {!splitView ? (
            <div className="flex-1 min-h-0 overflow-auto">
              {section === 'demographics' && demographicsData != null && (
                <PreviewTable
                  rows={sortedDemographicsRows}
                  columns={DEMOGRAPHICS_COLUMNS}
                  rowKey="user_id"
                  className="h-full min-h-[200px]"
                />
              )}
              {section === 'palettes' && palettesData != null && (
                <PreviewTable
                  rows={sortedPalettesRows}
                  columns={PALETTES_COLUMNS}
                  rowKey="id"
                  className="h-full min-h-[200px]"
                />
              )}
              {currentData == null && !currentLoading && (
                <p className="text-gray-500 text-sm py-8">Pulsa Previsualizar para cargar los datos.</p>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 gap-3">
              <div className="flex-1 min-h-0 flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Tabla</span>
                <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-gray-700">
                  {section === 'demographics' && demographicsData != null && (
                    <PreviewTable
                      rows={sortedDemographicsRows}
                      columns={DEMOGRAPHICS_COLUMNS}
                      rowKey="user_id"
                      className="h-full min-h-[120px]"
                    />
                  )}
                  {section === 'palettes' && palettesData != null && (
                    <PreviewTable
                      rows={sortedPalettesRows}
                      columns={PALETTES_COLUMNS}
                      rowKey="id"
                      className="h-full min-h-[120px]"
                    />
                  )}
                  {currentData == null && !currentLoading && (
                    <p className="text-gray-500 text-sm py-6 px-2">Pulsa Previsualizar para cargar los datos.</p>
                  )}
                </div>
              </div>
              <div className="flex-1 min-h-0 flex flex-col rounded-lg border border-gray-700 bg-gray-900/30 p-4 overflow-auto">
                <span className="text-xs text-gray-500 mb-2">Análisis estadístico</span>
                {section === 'demographics' && demographicsData && demographicsData.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-700 pb-2">
                      {(
                        [
                          { id: 'summary' as const, label: 'Resumen' },
                          { id: 'age' as const, label: 'Edad' },
                          { id: 'gender' as const, label: 'Género' },
                          { id: 'career' as const, label: 'Área' },
                          { id: 'upv' as const, label: 'UPV' },
                          { id: 'cross' as const, label: 'Cruces' },
                        ] as { id: DemographicsAnalysisTab; label: string }[]
                      ).map(({ id, label }) => (
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
                    {demographicsAnalysisTab === 'summary' && <SampleSummary data={demographicsData} />}
                    {demographicsAnalysisTab === 'age' && <DemographicsAgeChart data={demographicsData} />}
                    {demographicsAnalysisTab === 'gender' && <DemographicsGenderChart data={demographicsData} />}
                    {demographicsAnalysisTab === 'career' && <DemographicsCareerChart data={demographicsData} />}
                    {demographicsAnalysisTab === 'upv' && <DemographicsUpvChart data={demographicsData} />}
                    {demographicsAnalysisTab === 'cross' && (
                      <div className="space-y-3">
                        <label className="block text-xs text-gray-500">
                          Cruce bivariado
                          <select
                            value={crossOptionId}
                            onChange={(e) => setCrossOptionId(e.target.value)}
                            className="ml-2 mt-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200 text-sm"
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
          )}

          <p className="mt-4 text-gray-500 text-xs">
            Si falta algún informe, despliega las Edge Functions <code className="bg-gray-800 px-1 rounded">export-research-data</code> y <code className="bg-gray-800 px-1 rounded">export-research-demographics</code> y crea la tabla <code className="bg-gray-800 px-1 rounded">research_demographics</code> con <code className="bg-gray-800 px-1 rounded">docs/supabase-research-demographics.sql</code>.
          </p>
        </main>
      </div>
    </div>
  );
}
