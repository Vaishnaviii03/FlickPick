import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 ${
            align === 'right' ? 'right-0' : 'left-0'
          } min-w-[200px] glass-card p-1 animate-[fadeInUp_0.2s_ease-out_forwards]`}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-sm text-gray-200 rounded-lg transition-colors
                ${
                  item.danger
                    ? 'hover:bg-red-500/20 hover:text-red-300'
                    : 'hover:bg-white/10 hover:text-white'
                }
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown; 