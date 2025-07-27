
import React from 'react';

const ScaleIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c-1.472 0-2.882.265-4.185.75M12 12.75h.008v.008H12v-.008Zm-3.75 0h.008v.008H8.25v-.008Zm7.5 0h.008v.008h-.008v-.008Zm-3.75 2.25h.008v.008H12v-.008Zm-3.75 0h.008v.008H8.25v-.008Zm7.5 0h.008v.008h-.008v-.008Z" />
  </svg>
);

export default ScaleIcon;