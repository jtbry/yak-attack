import { XCircleIcon } from '@heroicons/react/solid';
import { useAppDispatch } from '../app/hooks';
import {
  AppNotification,
  dismissNotification,
} from '../features/notificationSlice';

interface NotificationProps {
  notification: AppNotification;
}

const Notification = ({ notification }: NotificationProps): JSX.Element => {
  const dispatch = useAppDispatch();

  let color = 'bg-emerald-700 text-white';
  if (notification.type === 'warn') {
    color = 'bg-yellow-700 text-white';
  } else if (notification.type === 'error') {
    color = 'bg-red-700 text-white';
  }

  return (
    <div className={`flex p-4 mb-4 ${color} rounded-md`} role="alert">
      <p className="text-sm font-medium break-all">{notification.message}</p>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8"
        aria-label="Close"
        onClick={() => dispatch(dismissNotification(notification.id ?? ''))}
      >
        <span className="sr-only">Close</span>
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;
