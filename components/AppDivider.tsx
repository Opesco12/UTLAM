import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";

const AppDivider = ({style}) => {
  return <View style={[styles.divider, style]}></View>;
};

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 1,
    borderColor: Colors.border,
    marginVertical: 10,
    width: "100%",
  },
});

export default AppDivider;
