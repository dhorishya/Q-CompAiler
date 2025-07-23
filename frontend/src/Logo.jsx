import React from 'react';

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7f5fff" />
        <stop offset="100%" stopColor="#3c8ce7" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" fill="url(#grad1)" opacity="0.85" />
    <path d="M16 32C16 28 20 26 24 26C28 26 32 28 32 32" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="19.5" cy="21" r="2.5" fill="#fff"/>
    <circle cx="28.5" cy="21" r="2.5" fill="#fff"/>
    <ellipse cx="24" cy="24" rx="18" ry="8" fill="#fff" opacity="0.08"/>
  </svg>
);

export default Logo; 