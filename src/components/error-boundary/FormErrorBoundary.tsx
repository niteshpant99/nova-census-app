// src/components/error-boundary/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error 
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ 
      hasError: false,
      error: undefined 
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Something went wrong</h2>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-sm text-red-600 bg-red-50 p-4 rounded-md">
                <p className="font-medium">Error details:</p>
                <p className="font-mono">{this.state.error.message}</p>
              </div>
            )}
            <p className="text-muted-foreground">
              There was an error loading this section. Please try again.
            </p>
            <Button
              onClick={this.handleReset}
              className="w-full"
            >
              Try again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}