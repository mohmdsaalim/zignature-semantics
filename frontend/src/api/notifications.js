import notificationsData from '../data/notifications.json';

export const notificationsApi = {
  getNotifications: async () => {
    return notificationsData;
  },

  markAsRead: async (id) => {
    console.log(`Mark notification ${id} as read`);
  },

  markAllAsRead: async () => {
    console.log('Mark all notifications as read');
  },

  deleteNotification: async (id) => {
    console.log(`Delete notification ${id}`);
  },
};
