import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'navigation' | 'small';
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  icon, 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`tactile-btn tactile-btn--${variant} ${className}`}
      {...props}
    >
      {icon && <span className="tactile-btn__icon">{icon}</span>}
      <span className="tactile-btn__label handwritten">{children}</span>
    </button>
  );
}
