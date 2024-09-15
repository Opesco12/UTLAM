import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Icon } from "@rneui/base";
import { router } from "expo-router";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

import { Colors } from "@/constants/Colors";
import AppHeader from "@/components/AppHeader";
import AppButton from "@/components/AppButton";
import Screen from "@/components/Screen";
import AppTextField from "@/components/AppTextField";
import StyledText from "@/components/StyledText";

import storeUserData from "../storage/userData";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Screen>
      <AppHeader />
      <View style={{ flex: 1 }}>
        <StyledText
          type="heading"
          variant="semibold"
          style={{ marginTop: 25 }}
          onPress={() =>
            showMessage({
              message: "Testing",
              description: "just checking to see if it'll show",
              type: "info",
            })
          }
        >
          Welcome Back!
        </StyledText>
        <StyledText
          type="title"
          variant="medium"
          color={Colors.light}
        >
          Login to your account
        </StyledText>

        <Formik
          validationSchema={validationSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const { email, password } = values;
            setEmail(email);
            axios
              .post(
                "https://xfundtestapi.utlam.com:2939/api/v1/login",
                { username: email, password: password },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  timeout: 10000,
                }
              )
              .then((res) => {
                setSubmitting(false);
                if (res.status === 200 || res.status === 220) {
                  resetForm();
                  console.log("should navigate here");
                  router.replace({
                    pathname: "/otp",
                    params: { username: email },
                  });
                }
              })
              .catch((error) => {
                setSubmitting(false);
                if (error.status === 400) {
                  showMessage({
                    message: "Invalid Username or Password",
                    type: "danger",
                  });
                } else {
                  showMessage({
                    message: "Please try again later",
                    type: "info",
                  });
                }
              });
          }}
        >
          {({ handleSubmit, handleChange, isSubmitting }) => (
            <View style={{ marginTop: 20, flex: 1 }}>
              <AppTextField
                label={"Username"}
                name="email"
                onChangeText={handleChange("email")}
                autoCapitalize="none"
              />
              <AppTextField
                label={"Password"}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    color={Colors.light}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                }
                name={"password"}
                onChangeText={handleChange("password")}
                secureTextEntry={hidePassword ? true : false}
              />
              <StyledText
                color={Colors.primary}
                style={{ textAlign: "right", textDecorationLine: "underline" }}
                onPress={() => {
                  router.push("/reset-password");
                }}
              >
                Forgot Password?
              </StyledText>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <AppButton onPress={handleSubmit}>
                  {isSubmitting ? (
                    <ActivityIndicator size={"small"} />
                  ) : (
                    "Login"
                  )}
                </AppButton>
                <StyledText
                  style={{ textAlign: "center", marginTop: 15 }}
                  type="body"
                  variant="medium"
                >
                  Don't have an account?{" "}
                  <StyledText
                    color={Colors.primary}
                    onPress={() => router.push("/register")}
                  >
                    Register
                  </StyledText>
                </StyledText>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </Screen>
  );
};

export default Login;
