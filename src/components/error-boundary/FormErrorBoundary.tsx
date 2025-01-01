// src/components/error-boundary/FormErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class FormErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Something went wrong</h2>
          <p className="mb-4">There was an error loading the form. Please try again.</p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="w-full"
          >
            Try again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}