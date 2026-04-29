import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineChatBubbleLeftRight, HiOutlineCog6Tooth, HiOutlineXMark } from 'react-icons/hi2';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'job_alert':
      return <HiOutlineBriefcase className="w-5 h-5 text-blue-600" />;
    case 'application_update':
      return <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />;
    case 'message':
      return <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-purple-600" />;
    case 'system':
      return <HiOutlineCog6Tooth className="w-5 h-5 text-gray-600" />;
    default:
      return <HiOutlineBell className="w-5 h-5 text-primary-600" />;
  }
};

const NotificationDropdown = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    onClose();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    deleteNotification(id);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="absolute right-0 mt-4 w-80 bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] z-50 max-h-[70vh] flex flex-col lg:w-80 md:w-72 sm:w-[calc(100vw-2rem)] sm:right-[-1rem]">
      <div className="px-4 py-3 border-b-2 border-primary-900 bg-primary-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-black text-primary-900 uppercase tracking-wider">
            Notifications ({unreadCount} unread)
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs font-bold text-primary-600 hover:text-primary-900 uppercase tracking-wider"
            >
              Mark all read
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 border-2 transition-colors ${
              activeTab === 'all'
                ? 'border-primary-900 bg-primary-100 text-primary-900'
                : 'border-primary-900/20 text-primary-900/60 hover:border-primary-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 border-2 transition-colors ${
              activeTab === 'unread'
                ? 'border-primary-900 bg-primary-100 text-primary-900'
                : 'border-primary-900/20 text-primary-900/60 hover:border-primary-900'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center text-primary-600 font-medium">Loading...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-600 font-medium">{error}</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="p-4 text-center text-primary-600 font-medium">
          No {activeTab === 'unread' ? 'unread ' : ''}notifications
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`block px-4 py-3 border-b-2 border-primary-900/20 hover:bg-primary-50 transition-colors ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <Link
                  to={notification.link}
                  onClick={() => handleNotificationClick(notification)}
                  className="flex-1 min-w-0"
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-black text-primary-900 truncate">{notification.title}</p>
                    {!notification.read && (
                      <span className="w-2.5 h-2.5 bg-red-500 border border-primary-900 rounded-none flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-primary-600 mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-xs font-mono text-primary-900/60 mt-1">{formatTimestamp(notification.timestamp)}</p>
                </Link>
                <button
                  onClick={(e) => handleDelete(e, notification.id)}
                  className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                  title="Delete notification"
                >
                  <HiOutlineXMark className="w-4 h-4 text-primary-900/50 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
