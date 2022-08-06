interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle: 'primary' | 'danger';
}

const buttonStyles = {
  primary: 'bg-teal-500 hover:bg-teal-600 disabled:bg-teal-900',
  danger: 'bg-red-500 hover:bg-red-600 disabled:bg-red-900',
};

const Button = (props: ButtonProps): JSX.Element => {
  const { className, buttonStyle, ...otherProps } = props;
  return (
    <button
      className={`justify-center p-2 text-sm font-bold rounded-md ${buttonStyles[buttonStyle]} ${className}`}
      {...otherProps}
    >
      {props.children}
    </button>
  );
};

export default Button;
