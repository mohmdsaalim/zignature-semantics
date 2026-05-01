import { create } from 'zustand';
import { notificationsApi } from '../api/notifications';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await notificationsApi.getNotifications();
      const unreadCount = data.filter(n => !n.read).length;
      set({ notifications: data, unreadCount, loading: false });
    } catch (err) {
      set({ error: 'Failed to load notifications', loading: false });
    }
  },

  markAsRead: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      notificationsApi.markAsRead(id);
      return { notifications: updatedNotifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const updatedNotifications = state.notifications.map(n => ({ ...n, read: true }));
      notificationsApi.markAllAsRead();
      return { notifications: updatedNotifications, unreadCount: 0 };
    });
  },

  deleteNotification: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.filter(n => n.id !== id);
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      notificationsApi.deleteNotification(id);
      return { notifications: updatedNotifications, unreadCount };
    });
  },
}));
