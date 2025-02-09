import React from 'react';
import Button from './Button';

export function FilterButtons({ filter, setFilter }) {
  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'templates', label: 'Alleen sjablonen' },
    { key: 'orders', label: 'Alleen losse orders' },
  ];

  return (
    <div className='mt-2 flex justify-center gap-2 border-t pt-2 bg-white sticky bottom-0 p-3'>
      {filters.map(({ key, label }) => (
        <Button
          key={key}
          text={label}
          color={filter === key ? 'bg-blue-500 text-white' : 'bg-gray-300'}
          onClick={() => setFilter(key)}
        />
      ))}
    </div>
  );
}
