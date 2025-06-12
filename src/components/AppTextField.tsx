import { TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import { useState } from "react";

const AppTextField = ({
  label,
  rightIcon,
  leftIcon,
  width,
  name,
  rightLabelStyle,
  rightLabel,
  rightLabelColor,
  isPassword = false,
  readonly,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { values, errors, touched } = useFormikContext();
  return (
    <View style={[styles.container, { width: width ? width : "100%" }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <StyledText
          color={Colors.primary}
          type="label"
          variant="medium"
          style={{ marginBottom: 2 }}
        >
          {label}
        </StyledText>
        <StyledText
          color={rightLabelColor ? rightLabelColor : Colors.primary}
          type="label"
          variant="medium"
          style={[rightLabelStyle, { marginBottom: 2, fontSize: 12 }]}
        >
          {rightLabel}
        </StyledText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isPassword && { paddingRight: 45 }]}
          value={values[name]}
          editable={readonly}
          secureTextEntry={!showPassword && isPassword}
          textContentType={isPassword ? "password" : "none"}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      {touched[name] && errors[name] && (
        <StyledText
          color={Colors.error}
          type="label"
          variant="medium"
        >
          {errors[name]}
        </StyledText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    height: 49,
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.black,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
});

export default AppTextField;
