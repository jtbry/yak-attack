import { useState } from 'react';

interface RadioGroupProps {
  buttons: Array<{
    label: string;
    value: string;
  }>;
  defaultValue?: string;
  groupLabel?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const RadioGroup = ({
  buttons,
  defaultValue,
  groupLabel,
  className,
  onChange,
}: RadioGroupProps): JSX.Element => {
  const [checkedValue, setCheckedValue] = useState(defaultValue);

  const handleClick = (value: string) => {
    setCheckedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={className ?? ''}>
      {groupLabel && <label className="text-lg font-bold">{groupLabel}</label>}
      <div className="flex flex-auto space-x-2">
        {buttons.map((button) => (
          <label className="w-full" key={button.value}>
            <input
              type="radio"
              value={button.value}
              checked={checkedValue == button.value}
              onChange={() => handleClick(button.value)}
              className="hidden peer"
            />
            <p className="flex-1 p-2 rounded border-2 peer-checked:border-teal-500 peer-checked:text-teal-500 bg-gray-200 border-gray-400 dark:bg-zinc-700 dark:border-zinc-600">
              {button.label}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
