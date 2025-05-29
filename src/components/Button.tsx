import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient';
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

const base = 'inline-flex items-center font-medium rounded-lg px-6 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 transform transition-transform hover:scale-105';
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900',
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
};

const Button = ({ variant = 'primary', children, iconLeft, iconRight, className = '', ...props }: ButtonProps) => (
  <button
    className={`${base} ${variants[variant]} ${className}`}
    {...props}
  >
    {iconLeft && <span className="mr-2">{iconLeft}</span>}
    {children}
    {iconRight && <span className="ml-2">{iconRight}</span>}
  </button>
);

export default Button; 