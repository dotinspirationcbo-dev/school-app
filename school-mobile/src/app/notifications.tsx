import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedList from '../components/ui/AnimatedList';
import ScreenHeader from '../components/ui/ScreenHeader';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import NotificationCard from '../components/ui/NotificationCard';
import { getNotifications, markAsRead, deleteNotification, markAllRead } from '../api/notifications';
import { toast } from '../utils/toast';
import { AuthContext } from '../contexts/AuthContext';

export default function Notifications() {
  const router = useRouter();
  const { pushRegistered } = useContext(AuthContext);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      if (res && res.success) {
        setItems(res.data || []);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
      toast('Error', 'Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleMarkRead = async (notification: any) => {
    try {
      const res = await markAsRead(notification._id || notification.id);
      if (res && res.success) {
        toast('Marked', 'Notification marked read', 'success');
        setItems((prev) => prev.map((i) => (i._id === notification._id ? { ...i, read: true } : i)));
      }
    } catch (err) {
      console.error(err);
      toast('Error', 'Unable to mark read', 'error');
    }
  };

  const handleDelete = async (notification: any) => {
    try {
      const res = await deleteNotification(notification._id || notification.id);
      if (res && res.success) {
        toast('Deleted', 'Notification deleted', 'success');
        setItems((prev) => prev.filter((i) => i._id !== notification._id));
      }
    } catch (err) {
      console.error(err);
      toast('Error', 'Unable to delete', 'error');
    }
  };

  const handleMarkAll = async () => {
    try {
      const res = await markAllRead();
      if (res && res.success) {
        toast('Marked', 'All notifications marked read', 'success');
        setItems((prev) => prev.map((i) => ({ ...i, read: true })));
      }
    } catch (err) {
      console.error(err);
      toast('Error', 'Unable to mark all read', 'error');
    }
  };

  const navigateOnPress = async (notification: any) => {
    if (!notification.read) {
      await handleMarkRead(notification);
    }

    switch (notification.type) {
      case 'attendance':
        router.push("../attendance");
        break;
      case 'marks':
        router.push("../students");
        break;
      default:
        router.push("../notifications");
        break;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <ScreenHeader
          title="Notifications"
          subtitle="Incoming alerts and updates"
          statusLabel={pushRegistered ? 'Push registered' : 'Push unavailable'}
          statusVariant={pushRegistered ? 'success' : 'warning'}
          actionLabel="Mark All"
          onAction={handleMarkAll}
        />
        <SkeletonLoader count={6} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Notifications"
        subtitle="Incoming alerts and updates"
        statusLabel={pushRegistered ? 'Push registered' : 'Push unavailable'}
        statusVariant={pushRegistered ? 'success' : 'warning'}
        actionLabel="Mark All"
        onAction={handleMarkAll}
      />

      <AnimatedList
        data={items}
        keyExtractor={(i) => i._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <EmptyState icon="🔔" title="No notifications" message="You're all caught up." />
        )}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={navigateOnPress}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
          />
        )}
      />
    </View>
  );
}
