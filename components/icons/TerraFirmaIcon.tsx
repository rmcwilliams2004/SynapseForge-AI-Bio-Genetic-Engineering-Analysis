import React from 'react';

export const GenomicIcon = ({ className }: { className?: string }) => (
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
    <path d="M4 4c0 5.523 3.582 10 8 10s8-4.477 8-10" />
    <path d="M20 20c0-5.523-3.582-10-8-10S4 14.477 4 20" />
    <line x1="8" y1="2" x2="8" y2="22" />
    <line x1="16" y1="2" x2="16" y2="22" />
  </svg>
);
