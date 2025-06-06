import { View } from "react-native";
import { Formik } from "formik";
import { toast } from "sonner-native";
import { router } from "expo-router";

import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";

import { registerExistingIndividual } from "@/src/api";
import { existingUserRegistrationSchema } from "@/src/validationSchemas";

const ExistingUserRegistration = () => {
  const handleRegistration = async (values) => {
    const { email, password, accountNumber } = values;

    try {
      const userData = await registerExistingIndividual({
        accountNo: accountNumber,
        password,
      });

      if (userData) {
        router.replace({
          pathname: "/(auth)/otp",
          params: {
            username: email,
            header: "Activate Account",
          },
        });
      }
    } catch (error) {
      //   toast.error("Registration failed");
    }
  };

  return (
    <Screen>
      <AppHeader />
      <View style={{ marginTop: 20 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Existing User?
        </StyledText>

        <StyledText
          color={Colors.light}
          type="body"
          variant="medium"
        >
          Register below
        </StyledText>

        <Formik
          initialValues={{
            accountNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={existingUserRegistrationSchema}
          onSubmit={handleRegistration}
        >
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <View style={{ marginTop: 25 }}>
              <AppTextField
                name={"accountNumber"}
                onChangeText={handleChange("accountNumber")}
                label={"Account Number"}
              />
              <AppTextField
                name={"email"}
                onChangeText={handleChange("email")}
                label={"Email Address"}
              />
              <AppTextField
                name={"password"}
                onChangeText={handleChange("password")}
                label={"Password"}
              />
              <AppTextField
                name={"confirmPassword"}
                onChangeText={handleChange("confirmPassword")}
                label={"Confirm Password"}
              />

              <AppButton
                customStyles={{ marginTop: 25 }}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                Register
              </AppButton>
            </View>
          )}
        </Formik>
      </View>
    </Screen>
  );
};

export default ExistingUserRegistration;
