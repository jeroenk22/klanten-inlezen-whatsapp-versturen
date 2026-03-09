import React from 'react';
import Button from './Button';

export function FilterButtons({ filter, setFilter }) {
  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'templates', label: 'Alleen sjablonen' },
    { key: 'orders', label: 'Alleen losse orders' },
  ];

  return (
    <div className='flex justify-center gap-2 border-b pb-2 bg-white p-3'>
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
