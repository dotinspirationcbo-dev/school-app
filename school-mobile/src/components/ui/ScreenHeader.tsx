import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  statusVariant?: 'success' | 'warning' | 'neutral';
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

export default function ScreenHeader({
  title,
  subtitle,
  statusLabel,
  statusVariant = 'neutral',
  actionLabel,
  onAction,
  style,
}: ScreenHeaderProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.rightColumn}>
        {statusLabel ? (
          <View style={[styles.statusBadge, styles[`status_${statusVariant}`]]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        ) : null}
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} style={styles.actionButton}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5ea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  actionText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  rightColumn: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  status_success: {
    backgroundColor: "#34C759",
  },
  status_warning: {
    backgroundColor: "#FF9500",
  },
  status_neutral: {
    backgroundColor: "#6B7280",
  },
});
