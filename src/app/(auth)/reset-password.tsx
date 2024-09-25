import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Formik } from "formik";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import { Colors } from "react-native/Libraries/NewAppScreen";

import { passwordResetSchema } from "../../validationSchemas";

const ResetPassword = () => {
  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginTop: 25 }}
      >
        Reset Password
      </StyledText>
      <StyledText
        color={Colors.light}
        type="body"
        variant="medium"
      >
        A Password reset link will be sent to your email
      </StyledText>

      <View style={{ marginTop: 20 }}>
        <Formik
          validationSchema={passwordResetSchema}
          initialValues={{ email: "" }}
        >
          {({ handleChange, handleSubmit }) => (
            <>
              <AppTextField
                name={"email"}
                onChangeText={handleChange("email")}
                label={"Email"}
              />
              <AppButton
                customStyles={{ marginTop: 20 }}
                onPress={handleSubmit}
              >
                Send Link
              </AppButton>
            </>
          )}
        </Formik>
      </View>
    </Screen>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

export default ResetPassword;
