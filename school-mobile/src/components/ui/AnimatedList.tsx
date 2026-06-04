import { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  FlatListProps,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
} from "react-native";

type AnimatedListProps = FlatListProps<any>;

const isAndroid = Platform.OS === "android";
if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AnimatedList(props: AnimatedListProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [props.data]);

  return (
    <Animated.FlatList
      {...props}
      style={[styles.list, props.style, { opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
});
