import React, { useState, useEffect, useMemo, useRef } from 'react';
import Table from './Table';
import Textarea from './Textarea';
import { generateMessage } from '../utils/messageTemplate';
import { renderCell } from '../utils/tableUtils';
import { FilterButtons } from '../components/FilterButtons';

export default function ApprovedCustomersTable({
  customers,
  onFilterChange,
  onMessageChange,
}) {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const isUserEditing = useRef(false);
  const prevFilteredCustomers = useRef([]);

  useEffect(() => {
    if (!isUserEditing.current) {
      const firstValidCustomer = customers.find((c) => c.datum?.trim() !== '');
      if (firstValidCustomer) {
        const initialMessage = generateMessage(firstValidCustomer.datum);
        setMessage(initialMessage);
        onMessageChange?.(initialMessage);
      }
    }
  }, [customers, onMessageChange]);

  const handleMessageChange = (newMessage) => {
    isUserEditing.current = true;
    setMessage(newMessage);
    onMessageChange?.(newMessage);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      if (filter === 'templates') return customer.sjabloon;
      if (filter === 'orders') return !customer.sjabloon;
      return true;
    });
  }, [customers, filter]);

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
      <MessageInput value={message} onChange={handleMessageChange} />
      <CustomerTable customers={filteredCustomers} />
      <FilterButtons filter={filter} setFilter={setFilter} />
    </div>
  );
}

function MessageInput({ value, onChange }) {
  return (
    <Textarea
      label='Te verzenden bericht'
      value={value}
      onChange={onChange}
      placeholder='Type hier je bericht...'
    />
  );
}

function CustomerTable({ customers }) {
  const tableData = useMemo(
    () => [
      ['Sjabloon', 'Naam', 'Plaats', 'Mobiel'],
      ...customers.map(({ sjabloon, naam, plaats, mobiel }) => [
        sjabloon,
        naam,
        plaats,
        mobiel,
      ]),
    ],
    [customers]
  );

  return (
    <div className='flex-grow overflow-y-auto max-h-[60vh] border-b'>
      <Table
        data={tableData}
        renderCell={renderCell}
        headerStyles={[{ width: '92px' }]}
      />
    </div>
  );
}
