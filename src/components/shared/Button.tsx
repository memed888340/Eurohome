import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-[#F2A900] text-white hover:bg-[#d99600] focus:ring-[#F2A900] active:scale-95': variant === 'primary',
          'bg-[#1A1A1A] text-white hover:bg-[#333] focus:ring-[#1A1A1A] active:scale-95': variant === 'secondary',
          'border-2 border-[#F2A900] text-[#F2A900] hover:bg-[#F2A900] hover:text-white focus:ring-[#F2A900] active:scale-95': variant === 'outline',
          'text-gray-600 hover:text-[#F2A900] hover:bg-orange-50 focus:ring-[#F2A900]': variant === 'ghost',
          'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
          'px-4 py-2.5 text-sm gap-2': size === 'md',
          'px-6 py-3.5 text-base gap-2': size === 'lg',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
