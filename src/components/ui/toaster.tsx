'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Toaster() {
  return null; // Simple mock implementation
}

export function useToast() {
  return {
    toast: ({
      title,
      description,
    }: {
      title?: string;
      description?: string;
    }) => {
      console.log('Toast:', { title, description });
    },
  };
}
