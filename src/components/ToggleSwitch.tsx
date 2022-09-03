import { Switch } from '@headlessui/react';

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label?: string;
}

const ToggleSwitch = ({ enabled, setEnabled, label }: ToggleSwitchProps) => {
  return (
    <Switch.Group>
      {label && (
        <Switch.Label className="text-sm font-medium">{label}</Switch.Label>
      )}
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-blue-400' : 'bg-blue-600'}
          inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Toggle {label ?? 'setting'}</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </Switch.Group>
  );
};

export default ToggleSwitch;
