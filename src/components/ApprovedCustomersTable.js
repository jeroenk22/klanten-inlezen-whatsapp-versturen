import React, { useState, useEffect, useMemo, useRef } from 'react';
import Table from './Table';
import Textarea from './Textarea';
import Button from './Button';
import { generateMessage } from '../utils/messageTemplate';

export default function ApprovedCustomersTable({
  customers,
  onFilterChange,
  onMessageChange,
}) {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all'); // "all", "templates", "orders"

  // Zoek de eerste beschikbare datum om het standaardbericht te genereren
  useEffect(() => {
    const firstValidCustomer = customers.find(
      (c) => c.datum && c.datum.trim() !== ''
    );
    if (firstValidCustomer) {
      const initialMessage = generateMessage(firstValidCustomer.datum);
      setMessage(initialMessage);
      if (onMessageChange) {
        onMessageChange(initialMessage);
      }
    }
  }, [customers, onMessageChange]);

  // Update de parent als de boodschap wordt gewijzigd
  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
    if (onMessageChange) {
      onMessageChange(newMessage);
    }
  };

  // Gebruik useMemo om `filteredCustomers` stabiel te houden
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      if (filter === 'templates') return customer.sjabloon;
      if (filter === 'orders') return !customer.sjabloon;
      return true;
    });
  }, [customers, filter]);

  // Zet de gefilterde data om naar een tabelstructuur
  const tableData = useMemo(
    () => [
      ['Sjabloon', 'Naam', 'Plaats', 'Mobiel'],
      ...filteredCustomers.map(({ sjabloon, naam, plaats, mobiel }) => [
        sjabloon,
        naam,
        plaats,
        mobiel,
      ]),
    ],
    [filteredCustomers]
  );

  // Render cell-functie voor het groene vinkje in de "Sjabloon"-kolom
  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 0) {
      return (
        <div className='flex justify-center items-center h-full'>
          {cell ? (
            <span
              className='text-green-500 text-lg leading-none'
              style={{ display: 'inline-block', height: '1rem' }}
            >
              ✔
            </span>
          ) : (
            ''
          )}
        </div>
      );
    }
    return cell; // Andere cellen blijven ongewijzigd
  };

  // Gebruik useRef om onnodige updates te voorkomen
  const prevFilteredCustomers = useRef([]);

  useEffect(() => {
    if (
      onFilterChange &&
      JSON.stringify(prevFilteredCustomers.current) !==
        JSON.stringify(filteredCustomers)
    ) {
      onFilterChange(filteredCustomers);
      prevFilteredCustomers.current = filteredCustomers;
    }
  }, [filteredCustomers, onFilterChange]);

  return (
    <div className='flex flex-col h-full'>
      {/* Berichttextarea */}
      <Textarea
        label='Te verzenden bericht'
        value={message}
        onChange={handleMessageChange} // ✅ Stuur wijzigingen door naar de parent
        placeholder='Type hier je bericht...'
      />

      {/* Scrollbare tabelcontainer met vaste hoogte */}
      <div className='flex-grow overflow-y-auto max-h-[60vh] border-b'>
        <Table
          data={tableData}
          renderCell={renderCell}
          headerStyles={[
            { width: '92px' }, // Specifieke breedte voor "Sjabloon"
          ]}
        />
      </div>

      {/* Filters onder de tabel, vastgezet onderaan */}
      <div className='mt-2 flex justify-center gap-2 border-t pt-2 bg-white sticky bottom-0 p-3'>
        <Button
          text='Alle'
          color={filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300'}
          onClick={() => setFilter('all')}
        />
        <Button
          text='Alleen sjablonen'
          color={
            filter === 'templates' ? 'bg-blue-500 text-white' : 'bg-gray-300'
          }
          onClick={() => setFilter('templates')}
        />
        <Button
          text='Alleen losse orders'
          color={filter === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-300'}
          onClick={() => setFilter('orders')}
        />
      </div>
    </div>
  );
}
