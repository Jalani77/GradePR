import { Component } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#E11D48] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-white" />
            </div>
            
            <h1 className="text-2xl font-black mb-2">Something went wrong</h1>
            <p className="text-[#545454] mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {this.state.error && (
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded p-4 mb-6 text-left">
                <p className="text-xs font-mono text-[#E11D48] break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="btn-primary rounded inline-flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
