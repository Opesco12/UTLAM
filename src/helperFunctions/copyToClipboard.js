import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";

export const copyToClipboard = async (text) => {
  await Clipboard.setStringAsync(text);
  toast.success("copied");
};
