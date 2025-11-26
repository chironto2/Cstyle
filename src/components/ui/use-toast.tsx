'use client';

import * as React from 'react';
import { ToastProvider } from '@/components/ui/toaster';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastProviderComponent,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProviderComponent>
      <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map(function ({
          id,
          title,
          description,
          action,
          open,
          onOpenChange,
        }) {
          return (
            <Toast
              key={id}
              open={open}
              onOpenChange={onOpenChange}
              className="mb-2"
            >
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
      </div>
    </ToastProviderComponent>
  );
}
