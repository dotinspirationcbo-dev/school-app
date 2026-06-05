import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { AuthContext } from '@/contexts/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm) / 2;

type QuickAction = {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
};

type StatItem = {
  label: string;
  value: string | number;
  progress: number;
  icon: string;
};

type ActivityItem = {
  id: string;
  text: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning';
};

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [notificationCount] = useState(3);

  // Mock data - replace with real API calls
  const quickActions: QuickAction[] = [
    {
      id: '1',
      icon: 'person-add',
      label: 'Add Student',
      onPress: () => console.log('Add Student'),
    },
    {
      id: '2',
      icon: 'card',
      label: 'Fees',
      onPress: () => console.log('Fees Payment'),
    },
    {
      id: '3',
      icon: 'bar-chart',
      label: 'Reports',
      onPress: () => console.log('Reports'),
    },
    {
      id: '4',
      icon: 'document-text',
      label: 'Receipts',
      onPress: () => console.log('Receipts'),
    },
  ];

  const stats: StatItem[] = [
    { label: 'Students', value: '1,240', progress: 100, icon: 'people' },
    { label: 'Fees Paid', value: '78%', progress: 78, icon: 'cash' },
    { label: 'Pending', value: '245', progress: 22, icon: 'alert-circle' },
    { label: 'Attendance', value: '94%', progress: 94, icon: 'checkmark-circle' },
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      text: 'John Kamya paid 200,000 UGX',
      timestamp: '2 hours ago',
      type: 'success',
    },
    {
      id: '2',
      text: 'New student enrolled: Amina N.',
      timestamp: '5 hours ago',
      type: 'info',
    },
    {
      id: '3',
      text: 'Fee reminder sent to parents',
      timestamp: '1 day ago',
      type: 'warning',
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.schoolName}>School App</Text>
          <Text style={styles.greeting}>
            {greeting()}, {user?.name?.split(' ')[0] || 'User'}
          </Text>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications" size={24} color={BrandColors.white} />
          {notificationCount > 0 && <View style={styles.badge} />}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.card}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={action.icon as any}
                    size={28}
                    color={BrandColors.primary}
                  />
                </View>
                <Text style={styles.cardText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STATS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Ionicons
                    name={stat.icon as any}
                    size={20}
                    color={BrandColors.accent}
                  />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${stat.progress}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.dot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },

  header: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingTop: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  schoolName: {
    color: BrandColors.white,
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
  },

  greeting: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: Typography.caption,
    marginTop: Spacing.sm / 2,
  },

  bell: {
    position: 'relative',
  },

  badge: {
    width: 8,
    height: 8,
    backgroundColor: BrandColors.accent,
    borderRadius: BorderRadius.full,
    position: 'absolute',
    top: -4,
    right: -4,
  },

  scrollView: {
    flex: 1,
  },

  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.h5,
    fontWeight: Typography.bold,
    color: BrandColors.primary,
    marginBottom: Spacing.md,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#F5F7FA',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 122, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardText: {
    marginTop: Spacing.sm,
    color: BrandColors.primary,
    fontWeight: Typography.semibold,
    fontSize: Typography.body,
    textAlign: 'center',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#F5F7FA',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  statLabel: {
    color: '#6B7A90',
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
  },

  statValue: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: BrandColors.primary,
    marginVertical: Spacing.sm,
  },

  progressBarBg: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: BrandColors.accent,
    borderRadius: BorderRadius.full,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    backgroundColor: '#F5F7FA',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: BrandColors.accent,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
    marginTop: Spacing.sm,
    flexShrink: 0,
  },

  activityContent: {
    flex: 1,
  },

  activityText: {
    color: BrandColors.primary,
    fontSize: Typography.body,
    fontWeight: Typography.medium,
  },

  activityTime: {
    color: '#999999',
    fontSize: Typography.caption,
    marginTop: Spacing.sm / 2,
  },
});
