import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

interface ListSelectorProps {
  value: any;
  list: any;
  onChange: (value: any) => void;
  mirror?: boolean;
}

const ListSelector = (props: ListSelectorProps): JSX.Element => {
  return (
    <Listbox value={props.value} onChange={props.onChange}>
      <div className="relative mt-1">
        <Listbox.Button
          className={`relative w-full rounded-md bg-slate-800 border border-slate-700 p-2 font-medium ${
            props.mirror ? 'text-right' : 'text-left'
          }`}
        >
          {props.value}
          <span
            className={`absolute ${
              props.mirror ? 'left-0' : 'right-0'
            } inset-y-0 flex items-center mr-3`}
          >
            <SelectorIcon className="w-5 h-5" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`w-full absolute mt-1 bg-slate-800 border border-slate-700 rounded-md p-2 cursor-pointer ${
              props.mirror ? 'text-right' : 'text-left'
            }`}
          >
            {props.list.map((item: any) => (
              <Listbox.Option
                key={item}
                value={item}
                className={({ active }) =>
                  `${active ? 'text-blue-400 font-bold' : ''}`
                }
              >
                {item}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default ListSelector;
