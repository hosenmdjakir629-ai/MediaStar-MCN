import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    if (error.name === 'AbortError' || error.message.toLowerCase().includes('aborted')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.name === 'AbortError' || error.message.toLowerCase().includes('aborted')) {
      console.warn('ErrorBoundary: Caught aborted request, ignoring:', error);
      return;
    }
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-orbit-900 flex items-center justify-center p-4">
          <div className="bg-orbit-800 border border-red-500/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <div className="bg-black/50 p-4 rounded-xl overflow-auto max-h-64 mb-6">
              <pre className="text-xs text-red-300 whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
