// src/components/error-boundary/FormErrorBoundary.tsx
'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface FormErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

/**
 * Form-specific error boundary with retry functionality
 * 
 * Designed specifically for form components, with a tailored error message
 * and additional form reset capabilities.
 */
export function FormErrorBoundary({ children, onReset }: FormErrorBoundaryProps) {
  const handleReset = () => {
    // Call parent reset handler if provided
    if (onReset) {
      onReset();
    }
  };

  // Custom fallback UI for form errors
  const fallback = (
    <Card className="p-6 max-w-md mx-auto my-4">
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Form Error</h2>
        <p className="text-muted-foreground mb-6">
          There was a problem with this form. Please try again or contact support if the issue persists.
        </p>
        <div className="flex gap-4">
          <Button onClick={handleReset} variant="outline">
            Reset Form
          </Button>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={console.error}>
      {children}
    </ErrorBoundary>
  );
}