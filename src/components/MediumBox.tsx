import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import {} from "iconsax-react-native";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import React from "react";

const MediumBox = React.forwardRef(
  ({ title, subtitle, icon, onPress, style }, ref) => {
    return (
      <Pressable
        ref={ref}
        style={[styles.container, style]}
        onPress={onPress}
      >
        <View>
          {icon}
          <StyledText
            color={Colors.lightPrimary}
            style={{ fontSize: 18, marginBottom: 5 }}
            variant="semibold"
          >
            {title}
          </StyledText>
          <StyledText
            color={Colors.lightPrimary}
            type="label"
            style={{ lineHeight: 14 }}
            variant="regular"
          >
            {subtitle}
          </StyledText>
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    minHeight: 90,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "48%",
  },
});

export default MediumBox;
