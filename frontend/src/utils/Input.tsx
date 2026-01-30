import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ type, placeholder, value, onChange }: InputProps) => {
  return (
    <input style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px' }} type={type} placeholder={placeholder} value={value} onChange={onChange} />
  );
}