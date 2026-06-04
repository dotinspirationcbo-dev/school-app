import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AnimatedButton from './AnimatedButton';

type NotificationCardProps = {
  notification: any;
  onPress?: (notification: any) => void;
  onMarkRead?: (notification: any) => void;
  onDelete?: (notification: any) => void;
};

const NotificationCard = ({ notification, onPress, onMarkRead, onDelete }: NotificationCardProps) => {
  const { title, message, createdAt, read } = notification;
  const date = createdAt ? new Date(createdAt).toLocaleString() : '';

  return (
    <Pressable onPress={() => onPress?.(notification)} style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.time}>{date}</Text>
      </View>
      <View style={styles.actions}>
        {!read && (
          <AnimatedButton title="Mark read" onPress={() => onMarkRead?.(notification)} />
        )}
        <AnimatedButton title="Delete" variant="danger" onPress={() => onDelete?.(notification)} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  message: { fontSize: 13, color: '#444' },
  time: { fontSize: 11, color: '#888', marginTop: 6 },
  actions: { marginLeft: 12, justifyContent: 'space-between' },
});

export default NotificationCard;
