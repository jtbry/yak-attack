import { RadioGroup } from '@headlessui/react';
import { BadgeCheckIcon } from '@heroicons/react/solid';

interface RadioSelectorProps {
  label: string;
  value: any;
  list: any;
  onChange: (value: any) => void;
}

const RadioSelector = (props: RadioSelectorProps) => {
  return (
    <RadioGroup value={props.value} onChange={props.onChange}>
      <RadioGroup.Label className="font-bold">{props.label}</RadioGroup.Label>
      <div className="flex flex-auto space-x-2 mt-1">
        {props.list.map((option: any) => (
          <RadioGroup.Option
            key={option.value}
            value={option.value}
            className={({ checked }) => `
                ${
                  checked ? 'border-blue-400 text-blue-400' : 'border-slate-700'
                }
                flex-1 p-2 rounded border-2 relative bg-slate-800
              `}
          >
            {({ checked }) => (
              <>
                <span>{option.label}</span>
                {checked && (
                  <div className="absolute right-0 inset-y-0 flex items-center pr-3">
                    <BadgeCheckIcon className="w-6 h-6" />
                  </div>
                )}
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioSelector;
