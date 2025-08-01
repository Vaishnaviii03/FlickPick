import React from 'react';

const Skeleton = ({ variant = 'rectangular', className = '', height, width }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 bg-[length:200%_100%] relative overflow-hidden';
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4 w-3/4',
    movie: 'rounded-xl aspect-[2/3]',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  const style = {
    height: height,
    width: width,
  };

  return (
    <div className={classes} style={style}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />
    </div>
  );
};

export const MovieCardSkeleton = () => (
  <div className="glass-card p-4 space-y-4">
    <Skeleton variant="movie" className="w-full" />
    <Skeleton variant="text" className="w-3/4" />
    <Skeleton variant="text" className="w-1/2" />
  </div>
);

export const MovieGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(count).fill(0).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton; 