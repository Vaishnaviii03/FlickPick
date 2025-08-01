import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ children, content, position = 'top', delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      default:
        break;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Wait for next frame to calculate position after tooltip is rendered
      requestAnimationFrame(calculatePosition);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-dark-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 pointer-events-none transition-opacity duration-200"
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-dark-800/95 border border-white/10 transform rotate-45 ${
              position === 'top' ? 'bottom-0 translate-y-1/2' :
              position === 'bottom' ? 'top-0 -translate-y-1/2' :
              position === 'left' ? 'right-0 translate-x-1/2' :
              'left-0 -translate-x-1/2'
            }`}
            style={{
              [position === 'top' || position === 'bottom' ? 'left' : 'top']: '50%',
              [position === 'top' || position === 'bottom' ? 'transform' : 'transform']: 
                position === 'top' ? 'translateX(-50%) translateY(50%)' :
                position === 'bottom' ? 'translateX(-50%) translateY(-50%)' :
                position === 'left' ? 'translateY(-50%) translateX(50%)' :
                'translateY(-50%) translateX(-50%)',
            }}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip; 