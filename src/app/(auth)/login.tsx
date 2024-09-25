import { ActivityIndicator, StyleSheet, Image, Text, View } from "react-native";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Icon } from "@rneui/base";
import { router } from "expo-router";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

import { Colors } from "@/src/constants/Colors";
import AppHeader from "@/src/components/AppHeader";
import AppButton from "@/src/components/AppButton";
import Screen from "@/src/components/Screen";
import AppTextField from "@/src/components/AppTextField";
import StyledText from "@/src/components/StyledText";

import storeUserData from "../storage/userData";
import { userLoginSchema } from "../../validationSchemas/userSchema";

const Header = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        paddingTop: 10,
      }}
    >
      <Image
        source={require("../../../assets/images/logo.png")}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

const Login = () => {
  const [email, setEmail] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <Screen>
      <Header />
      <View style={{ flex: 1 }}>
        <StyledText
          type="heading"
          variant="semibold"
          style={{ marginTop: 25 }}
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
          validationSchema={userLoginSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const { email, password } = values;
            setEmail(email);
            axios
              .post(
                "https://utl-proxy.vercel.app/api/v1/login",
                { username: email, password: password },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  timeout: 20000,
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
                    type: "warning",
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
