import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../contexts/AuthContext';

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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

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
  return useCallback(
    async (): Promise<T> => {
      if (!SUPABASE_URL || !session?.access_token) {
        throw new Error('Sesión o URL de Supabase no disponible');
      }
      const fnUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/${fnName}`;
      const res = await fetch(fnUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      const data = await res.json();
      return data as T;
    },
    [fnName, session?.access_token]
  );
}

function PreviewTable<T extends Record<string, unknown>>({
  rows,
  columns,
  rowKey,
}: {
  rows: T[];
  columns: { key: keyof T; label: string }[];
  /** Clave única por fila para React (ej. 'user_id', 'id'). Si no se pasa, se usa el índice. */
  rowKey?: keyof T;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No hay filas para mostrar.</p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-800/80 text-gray-300">
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
                <td key={String(col.key)} className="px-3 py-2 text-gray-300 max-w-[200px] truncate">
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

export function ResearchAnalysisPage({ onBack }: ResearchAnalysisPageProps) {
  const [error, setError] = useState<string | null>(null);

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
      const data = Array.isArray(raw) ? raw : [];
      setDemographicsData(data);
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
      const data = Array.isArray(raw) ? raw : [];
      setPalettesData(data);
    } catch (e) {
      setError(formatResearchError(e instanceof Error ? e.message : String(e)));
      setPalettesData(null);
    } finally {
      setPalettesLoading(false);
    }
  }, [fetchPalettes]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col">
      <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
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

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 space-y-10">
        <p className="text-gray-400">
          Previsualiza cada informe y descarga el Excel cuando quieras.
        </p>

        {error && (
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Informe 1: Sociodemográficas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Sociodemográficas de personas registradas</h2>
          <p className="text-gray-400 text-sm">
            Usuarios que dieron consentimiento y guardaron edad, género, área y si son estudiantes UPV.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreviewDemographics}
              disabled={demographicsLoading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {demographicsLoading ? 'Cargando…' : 'Previsualizar'}
            </button>
            {demographicsData != null && (
              <button
                type="button"
                onClick={downloadDemographicsExcel}
                disabled={demographicsData.length === 0}
                className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 disabled:opacity-50 text-gray-300 text-sm transition-colors"
              >
                Descargar Excel
              </button>
            )}
          </div>
          {demographicsData != null && (
            <div className="mt-4">
              <PreviewTable rows={demographicsData} columns={DEMOGRAPHICS_COLUMNS} rowKey="user_id" />
            </div>
          )}
        </section>

        {/* Informe 2: Paletas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Paletas guardadas</h2>
          <p className="text-gray-400 text-sm">
            Todas las paletas guardadas en la base de datos (nombre, colores, fecha).
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreviewPalettes}
              disabled={palettesLoading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {palettesLoading ? 'Cargando…' : 'Previsualizar'}
            </button>
            {palettesData != null && (
              <button
                type="button"
                onClick={downloadPalettesExcel}
                disabled={palettesData.length === 0}
                className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 disabled:opacity-50 text-gray-300 text-sm transition-colors"
              >
                Descargar Excel
              </button>
            )}
          </div>
          {palettesData != null && (
            <div className="mt-4">
              <PreviewTable rows={palettesData} columns={PALETTES_COLUMNS} rowKey="id" />
            </div>
          )}
        </section>

        <p className="text-gray-500 text-xs">
          Si falta algún informe, despliega las Edge Functions <code className="bg-gray-800 px-1 rounded">export-research-data</code> y <code className="bg-gray-800 px-1 rounded">export-research-demographics</code> y crea la tabla <code className="bg-gray-800 px-1 rounded">research_demographics</code> con <code className="bg-gray-800 px-1 rounded">docs/supabase-research-demographics.sql</code>.
        </p>
      </main>
    </div>
  );
}
