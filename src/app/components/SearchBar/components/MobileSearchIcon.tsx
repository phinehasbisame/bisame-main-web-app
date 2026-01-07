import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface MobileSearchIconProps {
  onClick: () => void;
  className?: string;
}

const MobileSearchIcon: React.FC<MobileSearchIconProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 md:p-3 rounded-full border border-gray-400 shadow-lg hover:shadow-xl
        hover:border-orange-200
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        ${className}
      `}
      aria-label="Open search"
    >
      <FaSearch size={15} className="text-gray-400 hover:text-orange-500 transition-colors duration-200" />
    </button>
  );
};

export default MobileSearchIcon;
