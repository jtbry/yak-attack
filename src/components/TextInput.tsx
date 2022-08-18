import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput = (props: TextInputProps): JSX.Element => {
  const { className, ...otherProps } = props;
  return (
    <input
      type="text"
      className={`focus:outline-none focus:ring-1 focus:ring-blue-400 bg-slate-800 border-slate-700 border p-2 block rounded-md ${className}`}
      {...otherProps}
    />
  );
};

export default TextInput;
