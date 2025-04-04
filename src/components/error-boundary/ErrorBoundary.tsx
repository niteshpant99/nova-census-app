// src/components/error-boundary/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for handling runtime errors
 * 
 * Catches JavaScript errors in its child component tree and displays a fallback UI
 * instead of crashing the whole application.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="p-6 max-w-md mx-auto my-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              An error occurred while rendering this component.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded-md w-full mb-6 overflow-auto text-left">
                <p className="font-mono text-sm">{this.state.error.toString()}</p>
              </div>
            )}
            <Button onClick={this.handleReset}>Try Again</Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}