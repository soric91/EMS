import React from 'react';
import { motion } from 'framer-motion';
const DeviceIcon = ({ 
  icon: Icon, 
  label, 
  iconColor, 
  size = "md",
  className = "",
  delay = 0
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8 md:w-10 md:h-10",
    lg: "w-10 h-10 md:w-12 md:h-12"
  };

  return (
    <motion.div 
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
    >
      <Icon className={`${sizeClasses[size]} ${iconColor}`} />
      <span className="mt-1 text-xs text-center leading-tight">
        {label.includes(' ') ? (
          label.split(' ').map((word, index) => (
            <React.Fragment key={index}>
              {word}
              {index < label.split(' ').length - 1 && <br />}
            </React.Fragment>
          ))
        ) : (
          label
        )}
      </span>
    </motion.div>
  );
};

export default DeviceIcon;