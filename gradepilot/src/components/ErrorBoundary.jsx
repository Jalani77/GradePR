import { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * Global Error Boundary
 * Catches rendering errors and database connection issues,
 * shows a user-friendly error message with retry option.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-black mb-2">Something went wrong</h2>
            <p className="text-sm text-[#545454] mb-6">
              {this.state.error?.message?.includes('fetch')
                ? 'Unable to connect to the database. Please check your internet connection and try again.'
                : 'An unexpected error occurred. Please try refreshing the page.'
              }
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#000000] text-white font-semibold rounded-lg hover:opacity-85 transition-opacity"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-[#CCCCCC] cursor-pointer">Technical details</summary>
                <pre className="mt-2 p-3 bg-white rounded-lg border border-[#EEEEEE] text-xs text-[#545454] overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
