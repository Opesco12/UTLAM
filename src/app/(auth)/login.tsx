import { ActivityIndicator, Image, View } from "react-native";
import { useState } from "react";
import { Formik } from "formik";
import { router } from "expo-router";
import { toast } from "sonner-native";

import { Colors } from "@/src/constants/Colors";
import AppButton from "@/src/components/AppButton";
import Screen from "@/src/components/Screen";
import AppTextField from "@/src/components/AppTextField";
import StyledText from "@/src/components/StyledText";

import { userLoginSchema } from "../../validationSchemas/userSchema";
import { login } from "@/src/api";

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
        style={{ alignSelf: "center", height: 35, width: 35 }}
      />
    </View>
  );
};

const Login = () => {
  const [email, setEmail] = useState(null);

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
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const { email, password } = values;
            setEmail(email);
            try {
              const response = await login(email, password);
              if (response) {
                if (response?.message?.includes("Account is inactive")) {
                  toast.error("Account is inactive. Please activate account");
                  router.push({
                    pathname: "/otp",
                    params: {
                      username: email,
                      header: "Activate Account",
                    },
                  });
                } else {
                  router.push({
                    pathname: "/otp",
                    params: {
                      username: email,
                    },
                  });
                }
                resetForm();
              }
            } catch (error) {
              toast.error("Login failed. Please check your credentials");
            } finally {
              setSubmitting(false);
            }
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
                isPassword={true}
                name={"password"}
                onChangeText={handleChange("password")}
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
                    <ActivityIndicator
                      color={Colors.white}
                      size={"small"}
                    />
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
