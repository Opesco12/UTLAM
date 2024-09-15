//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import Screen from "@/components/Screen";
import AppHeader from "@/components/AppHeader";
import StyledText from "@/components/StyledText";
import AppTextField from "@/components/AppTextField";
import AppButton from "@/components/AppButton";
import { Colors } from "react-native/Libraries/NewAppScreen";

// create a component
const ResetPassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
  });
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
          validationSchema={validationSchema}
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
