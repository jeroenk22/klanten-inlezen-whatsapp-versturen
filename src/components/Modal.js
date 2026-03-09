import React, { useEffect } from 'react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerButtons,
}) {
  useEffect(() => {
    if (!isOpen) return;

    // Voorkom scrollen van de achtergrond
    document.body.style.overflow = 'hidden';

    // Sluit modal met Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg w-11/12 max-w-4xl flex flex-col h-[90vh]'>
        {/* Header */}
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-xl font-bold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            ✖
          </button>
        </div>

        {/* Scrollbare inhoud */}
        <div className='overflow-y-auto flex-1 p-4'>{children}</div>

        {/* Footer met buttons */}
        <div className='flex justify-end gap-4 p-4 border-t bg-white'>
          {footerButtons.map((btn, idx) => (
            <Button key={idx} {...btn} />
          ))}
        </div>
      </div>
    </div>
  );
}
