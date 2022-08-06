import { useAppSelector } from '../app/hooks';
import Notification from './Notification';

const NotificationContainer = (): JSX.Element => {
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  if (notifications.length === 0) {
    return <></>;
  }

  return (
    <div>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
