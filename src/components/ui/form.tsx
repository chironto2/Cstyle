import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormContextType {
  register?: any;
  formState?: any;
  watch?: any;
}

const FormContext = React.createContext<FormContextType>({});

export const Form = ({ children, ...props }: any) => (
  <FormContext.Provider value={{}}>
    <div {...props}>{children}</div>
  </FormContext.Provider>
);

export const FormField = ({ label, error, children }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium mb-2">{label}</label>}
    {children}
    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);

export const FormItem = ({ children, className }: any) => (
  <div className={cn('space-y-2', className)}>{children}</div>
);

export const FormLabel = ({ children, className }: any) => (
  <label className={cn('text-sm font-medium leading-none', className)}>
    {children}
  </label>
);

export const FormControl = ({ children }: any) => <div>{children}</div>;

export const FormMessage = ({ children, className }: any) => (
  <p className={cn('text-sm font-medium text-red-500', className)}>
    {children}
  </p>
);
