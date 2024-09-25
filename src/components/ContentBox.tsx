import { StyleSheet, Text, View, Pressable } from "react-native";

import { Colors } from "@/src/constants/Colors";

const ContentBox = ({ children, customStyles, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, customStyles]}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightPrimary,
  },
});

export default ContentBox;
