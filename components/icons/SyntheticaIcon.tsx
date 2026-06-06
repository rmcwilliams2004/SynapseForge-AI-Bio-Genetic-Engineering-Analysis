import React from 'react';

export const SyntheticBioIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v5" />
    <path d="M12 17v5" />
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    <path d="M12 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
    <path d="M19.07 4.93l-3.53 3.53" />
    <path d="M4.93 19.07l3.53-3.53" />
  </svg>
);
