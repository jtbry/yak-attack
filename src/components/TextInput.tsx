import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput = (props: TextInputProps): JSX.Element => {
  const { className, ...otherProps } = props;
  return (
    <input
      type="text"
      className={`focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-200 border-gray-400 dark:bg-zinc-700 dark:border-zinc-600 border p-2 block rounded-md ${className}`}
      {...otherProps}
    />
  );
};

export default TextInput;
