import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const toast = (title: string, message?: string, type?: ToastType) => {
  const toastType: ToastType = type
    ? type
    : title.toLowerCase().includes("error")
    ? "error"
    : title.toLowerCase().includes("success")
    ? "success"
    : "info";

  Toast.show({
    type: toastType,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 2500,
    topOffset: 60,
  });
};
