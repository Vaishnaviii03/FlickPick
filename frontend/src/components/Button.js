import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl focus:ring-primary-500/50',
    secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm',
    outline: 'border border-white/20 hover:bg-white/10 text-white',
    ghost: 'hover:bg-white/10 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="relative">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="relative">{icon}</span>
          )}
        </>
      )}

      {/* Hover effect overlay */}
      <span className="absolute inset-0 rounded-lg overflow-hidden">
        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </span>
    </button>
  );
};

export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <Button
      variant={variant}
      className={sizes[size]}
      icon={icon}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default Button; 