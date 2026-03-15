import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, BarChart3, Table2, LayoutGrid } from 'lucide-react';
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

const DEMOGRAPHICS_COLUMNS: { key: keyof DemographicsRow; label: string }[] = [
  { key: 'user_id', label: 'User ID' },
  { key: 'age_range', label: 'Edad' },
  { key: 'gender', label: 'Género' },
  { key: 'design_career', label: 'Área diseño' },
  { key: 'is_upv_student', label: 'Estudiante UPV' },
  { key: 'consented_at', label: 'Fecha consentimiento' },
];

const PALETTES_COLUMNS: { key: keyof PaletteRow; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'user_id', label: 'User ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'color_1', label: 'Color 1' },
  { key: 'color_2', label: 'Color 2' },
  { key: 'created_at', label: 'Creado' },
];

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

/** Gráfico de barras simple: distribución por edad (sociodemográficas). */
function DemographicsAgeChart({ data }: { data: DemographicsRow[] }) {
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach((r) => {
      const k = r.age_range?.trim() || 'Sin indicar';
      m[k] = (m[k] ?? 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [data]);
  const max = Math.max(1, ...counts.map(([, n]) => n));

  if (counts.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">Carga sociodemográficas para ver la distribución.</p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">Distribución por rango de edad</h3>
      <div className="space-y-2">
        {counts.map(([label, n]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-20 text-xs text-gray-400 shrink-0">{label}</span>
            <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded min-w-[2px] transition-all"
                style={{ width: `${(n / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-6 text-right">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResearchAnalysisPage({ onBack }: ResearchAnalysisPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<SectionId>('demographics');
  const [splitView, setSplitView] = useState(false);

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

  const downloadDemographicsExcel = useCallback(() => {
    if (!demographicsData || demographicsData.length === 0) return;
    const sheetData = demographicsData.map((r) => ({
      user_id: r.user_id,
      age_range: r.age_range ?? '',
      gender: r.gender ?? '',
      design_career: r.design_career ?? '',
      is_upv_student: r.is_upv_student ?? '',
      consented_at: r.consented_at,
    }));
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sociodemográficas');
    XLSX.writeFile(wb, `chromatica-sociodemograficas-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [demographicsData]);

  const downloadPalettesExcel = useCallback(() => {
    if (!palettesData || palettesData.length === 0) return;
    const sheetData = palettesData.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      name: r.name ?? '',
      color_1: r.color_1 ?? '',
      color_2: r.color_2 ?? '',
      color_3: r.color_3 ?? '',
      color_4: r.color_4 ?? '',
      color_5: r.color_5 ?? '',
      color_6: r.color_6 ?? '',
      color_7: r.color_7 ?? '',
      color_8: r.color_8 ?? '',
      created_at: r.created_at,
    }));
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paletas');
    XLSX.writeFile(wb, `chromatica-paletas-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [palettesData]);

  const currentData = section === 'demographics' ? demographicsData : palettesData;
  const currentLoading = section === 'demographics' ? demographicsLoading : palettesLoading;
  const currentSection = SECTIONS.find((s) => s.id === section)!;
  const canDownload =
    (section === 'demographics' && demographicsData && demographicsData.length > 0) ||
    (section === 'palettes' && palettesData && palettesData.length > 0);

  const excelAreaClass = splitView ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1 min-h-0 overflow-auto';

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
          </div>

          {!splitView ? (
            <div className="flex-1 min-h-0 overflow-auto">
              {section === 'demographics' && demographicsData != null && (
                <PreviewTable
                  rows={demographicsData}
                  columns={DEMOGRAPHICS_COLUMNS}
                  rowKey="user_id"
                  className="h-full min-h-[200px]"
                />
              )}
              {section === 'palettes' && palettesData != null && (
                <PreviewTable
                  rows={palettesData}
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
                      rows={demographicsData}
                      columns={DEMOGRAPHICS_COLUMNS}
                      rowKey="user_id"
                      className="h-full min-h-[120px]"
                    />
                  )}
                  {section === 'palettes' && palettesData != null && (
                    <PreviewTable
                      rows={palettesData}
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
                  <DemographicsAgeChart data={demographicsData} />
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
