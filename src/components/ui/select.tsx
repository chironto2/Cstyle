import * as React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent',
        'bg-white text-gray-900 text-sm',
        className
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  )
);
Select.displayName = 'Select';

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent',
        'bg-white text-gray-900 text-sm flex items-center justify-between',
        'hover:bg-gray-50',
        className
      )}
      type="button"
      {...props}
    />
  )
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md',
        className
      )}
      {...props}
    />
  )
);
SelectContent.displayName = 'SelectContent';

interface SelectItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, ...props }, ref) => (
    <option
      ref={ref}
      className={cn('py-1.5 pl-2 pr-8 text-sm outline-none', className)}
      {...props}
    />
  )
);
SelectItem.displayName = 'SelectItem';

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, ...props }, ref) => (
    <span ref={ref} {...props}>
      {placeholder}
    </span>
  )
);
SelectValue.displayName = 'SelectValue';

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
