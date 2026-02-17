import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f1e4c8] px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#7b2d1f] mb-4">Oops! Something went wrong</h1>
            <p className="text-[#6b4b3e] mb-6">Please try refreshing the page.</p>
            <details className="text-left bg-[#fffcf5] p-4 rounded-lg text-sm overflow-auto max-h-48">
              <summary className="cursor-pointer font-bold text-[#7b2d1f]">Error details</summary>
              <pre className="mt-2 text-red-600 whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
