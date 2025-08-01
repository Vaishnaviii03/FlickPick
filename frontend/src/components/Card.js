import React from 'react';

const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
  as = 'div',
}) => {
  const Component = as;
  
  const baseClasses = 'glass-card overflow-hidden';
  const hoverClasses = hover ? 'transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-lg' : '';
  const glowClasses = glow ? 'hover:shadow-primary-500/20' : '';
  const clickClasses = onClick ? 'cursor-pointer active:scale-[0.98]' : '';
  
  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export const MovieCard = ({
  title,
  image,
  rating,
  year,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className="group relative"
      glow
    >
      {/* Image */}
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white mb-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            <span className="text-yellow-400">★ {rating}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{year}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ContentCard = ({
  title,
  subtitle,
  icon,
  children,
  footer,
  onClick,
}) => {
  return (
    <Card onClick={onClick} className="flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 p-6 border-b border-white/10">
        {icon && (
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default Card; 