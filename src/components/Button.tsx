interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle: 'primary' | 'danger';
}

const Button = (props: ButtonProps): JSX.Element => {
  const { className, buttonStyle, ...otherProps } = props;
  return (
    <button
      className={`
        ${
          buttonStyle === 'primary'
            ? 'bg-blue-400 hover:bg-blue-600 disabled:bg-blue-900'
            : 'bg-red-500 hover:bg-red-600 disabled:bg-red-900'
        }
        ${className}
        justify-center p-2 text-sm font-bold rounded-md 
      `}
      {...otherProps}
    >
      {props.children}
    </button>
  );
};

export default Button;
