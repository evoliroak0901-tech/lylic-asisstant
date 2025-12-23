
import React from 'react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'tag';
  active?: boolean;
  themeColor?: ThemeColor; // Optional: Override or pass current theme
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  active = false,
  themeColor = 'orange',
  className = '', 
  ...props 
}) => {
  const t = THEMES[themeColor];
  const baseStyles = "transition-all duration-200 active:scale-95 font-medium flex items-center justify-center";
  
  // Construct dynamic classes based on variant and theme
  let variantStyles = "";
  
  if (variant === 'primary') {
      variantStyles = `${t.buttonPrimary} ${t.buttonHover} text-white rounded-lg shadow-sm px-4 py-2 text-sm`;
  } else if (variant === 'secondary') {
      variantStyles = `bg-white border-2 border-gray-200 ${t.textSecondary} hover:${t.bgSoft} rounded-lg px-3 py-1 text-xs`;
  } else if (variant === 'icon') {
      variantStyles = `p-2 rounded-full hover:${t.bgPanel} ${t.textPrimary}`;
  } else if (variant === 'tag') {
      variantStyles = `px-3 py-2 rounded-lg text-sm font-bold shadow-sm border ${
        active 
        ? `${t.buttonPrimary} text-white ${t.borderStrong}` 
        : `bg-white ${t.textSecondary} border-gray-200 hover:${t.bgSoft}`
      }`;
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
