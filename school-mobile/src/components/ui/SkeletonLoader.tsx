import { View, StyleSheet, ViewStyle } from "react-native";

type SkeletonLoaderProps = {
  count?: number;
  style?: ViewStyle;
};

export default function SkeletonLoader({ count = 3, style }: SkeletonLoaderProps) {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.lineShort} />
          <View style={styles.lineLong} />
          <View style={[styles.lineLong, styles.lineHalf]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    width: "100%",
    minHeight: 88,
    borderRadius: 16,
    backgroundColor: "#e9e9ef",
    padding: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  lineShort: {
    width: "40%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "#d7d7de",
    marginBottom: 12,
  },
  lineLong: {
    width: "100%",
    height: 12,
    borderRadius: 7,
    backgroundColor: "#d7d7de",
    marginBottom: 10,
  },
  lineHalf: {
    width: "60%",
  },
});
