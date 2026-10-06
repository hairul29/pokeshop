import { Link } from 'react-router-dom';
import { Badge, Popover } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useStore } from '../context/StoreContext';

/** audience = "admin" for the admin panel, or the signed-in shopper's user id. */
export default function NotificationBell({ audience }: { audience: string }) {
  const { notifications, markNotificationsRead, clearNotifications } = useStore();
  const mine = notifications.filter((n) => n.audience === audience);
  const unread = mine.filter((n) => !n.read).length;

  const panel = (
    <div className="notif">
      <div className="notif__head">
        <b>Notifications</b>
        {mine.length > 0 && (
          <button type="button" className="link-btn" onClick={() => clearNotifications(audience)}>Clear all</button>
        )}
      </div>
      {mine.length === 0 ? (
        <p className="notif__empty">You're all caught up.</p>
      ) : (
        <ul className="notif__list">
          {mine.slice(0, 8).map((n) => (
            <li key={n.id} className={n.read ? '' : 'is-unread'}>
              <Link to={n.link}>{n.text}</Link>
              <span>{new Date(n.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Popover
      content={panel}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      onOpenChange={(open) => { if (!open && unread > 0) markNotificationsRead(audience); }}
    >
      <button type="button" className="icon-btn" aria-label={`Notifications, ${unread} unread`}>
        <Badge count={unread} size="small" color="#EE1515" offset={[2, -2]}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </button>
    </Popover>
  );
}