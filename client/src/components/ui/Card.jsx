import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  const isInteractive = hover || !!onClick;

  return (
    <motion.div
      className={`card-modern ${className} ${isInteractive ? 'cursor-pointer' : ''}`.trim()}
      onClick={onClick}
      initial={false}
      whileHover={isInteractive ? {
        y: -4,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
        borderColor: "var(--brand-primary)"
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;

