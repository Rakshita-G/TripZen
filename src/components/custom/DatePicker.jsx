import React from 'react';

export function DatePickerInput({ date, setDate, className, placeholder = "Select date" }) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    if (e.target.value) {
      const selectedDate = new Date(e.target.value);
      setDate(selectedDate.toISOString());
    } else {
      setDate('');
    }
  };

  return (
    <div className={className}>
      <input
        type="date"
        value={formatDateForInput(date)}
        onChange={handleChange}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}
