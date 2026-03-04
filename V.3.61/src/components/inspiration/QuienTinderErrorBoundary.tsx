import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/** Evita pantalla en blanco si un personaje o el Tinder lanza un error. */
export class QuienTinderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[QuienTinder] Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      const errMsg = this.state.error?.message ?? '';
      const isDev = import.meta.env?.DEV;
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-800/50 rounded-2xl border border-gray-600/50 min-h-[320px]">
          <p className="text-amber-400 font-medium">Algo falló al mostrar las criaturas</p>
          {isDev && errMsg && (
            <p className="text-xs text-red-400 font-mono max-w-md break-words text-center">{errMsg}</p>
          )}
          <p className="text-sm text-gray-500">Recarga la página o vuelve atrás e inténtalo de nuevo.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
