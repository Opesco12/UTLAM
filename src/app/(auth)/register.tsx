import {
  View,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Formik, Field } from "formik";
import { toast } from "sonner-native";
import Checkbox from "expo-checkbox";

import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import AppPicker from "@/src/components/AppPicker";
import DatePicker from "@/src/components/AppDatePicker";
import Terms from "@/src/components/Terms";

import {
  RegisterStep1ValidationSchema,
  RegisterStep2ValidationSchema,
} from "../../validationSchemas/userSchema";

import { registerNewIndividual, getCountries } from "../../api/index";

const Register = () => {
  const [countries, setCountries] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const countries = await getCountries();
      if (countries) {
        setCountries(
          countries.map((country) => ({
            label: country.name,
            value: country.code,
          }))
        );
      }
    };
    fetchData();
  }, []);

  const handleRegistration = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const {
      firstname,
      lastname,
      password,
      phoneNumber,
      address,
      email,
      city,
      state,
      gender,
      dob,
      country,
      nin,
      bvn,
      referralCode,
    } = values;

    const data = {
      dateOfBirth: dob,
      emailAddress: email,
      password: password,
      firstName: firstname,
      lastName: lastname,
      phoneNo: phoneNumber,
      clientType: 1,
      gender: gender,
      address1: address,
      city: city,
      state: state,
      country: country,
      nin: nin,
      bvn: bvn,
      referralCode: referralCode,
    };

    const response = await registerNewIndividual(data);
    if (response) {
      setSubmitting(false);
      toast.success(
        "You have successfully created an account. Activate your account to continue."
      );
      router.replace({
        pathname: "/(auth)/otp",
        params: {
          username: email,
          header: "Activate Account",
        },
      });
    }
    setSubmitting(false);
  };

  const validateStep1 = async (values, setErrors, setTouched) => {
    try {
      await RegisterStep1ValidationSchema.validate(values, {
        abortEarly: false,
      });
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setErrors(errors);
      setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return false;
    }
  };

  return (
    <Screen>
      <AppHeader />
      <View style={styles.stepIndicator}>
        <View
          style={[
            styles.step,
            currentStep === 1 ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <StyledText
            type="body"
            variant="semibold"
            color={currentStep === 1 ? Colors.white : Colors.black}
          >
            1
          </StyledText>
        </View>
        <View style={styles.stepLine} />
        <View
          style={[
            styles.step,
            currentStep === 2 ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <StyledText
            type="body"
            variant="semibold"
            color={currentStep === 2 ? Colors.white : Colors.black}
          >
            2
          </StyledText>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        {currentStep === 1 && (
          <>
            <StyledText
              type="heading"
              variant="semibold"
            >
              Hello, It's nice to meet you
            </StyledText>
            <StyledText
              color={Colors.light}
              type="body"
              variant="medium"
            >
              Sign up for an account below
            </StyledText>
          </>
        )}
        {currentStep === 2 && (
          <>
            <StyledText
              type="heading"
              variant="semibold"
            >
              Almost there!
            </StyledText>
            <StyledText
              color={Colors.light}
              type="body"
              variant="medium"
            >
              Complete your profile details
            </StyledText>
          </>
        )}

        <Formik
          validationSchema={
            currentStep === 1
              ? RegisterStep1ValidationSchema
              : RegisterStep2ValidationSchema
          }
          initialValues={{
            firstname: "",
            lastname: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: "",
            city: "",
            state: "",
            gender: "",
            country: "",
            dob: "",
            nin: "",
            bvn: "",
            referralCode: "",
            agreedToTerms: false,
            clientType: 1,
          }}
          onSubmit={async (
            values,
            { setSubmitting, setErrors, setTouched }
          ) => {
            if (currentStep === 1) {
              const isValid = await validateStep1(
                values,
                setErrors,
                setTouched
              );
              if (isValid) {
                setCurrentStep(2);
              }
            } else {
              await handleRegistration(values, { setSubmitting });
            }
          }}
        >
          {({
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            touched,
            values,
            errors,
          }) => (
            <View style={{ marginTop: 20 }}>
              {currentStep === 1 && (
                <>
                  <AppTextField
                    onChangeText={handleChange("firstname")}
                    name="firstname"
                    label="First Name"
                  />
                  <AppTextField
                    onChangeText={handleChange("lastname")}
                    name="lastname"
                    label="Last Name"
                  />
                  <AppTextField
                    onChangeText={handleChange("phoneNumber")}
                    name="phoneNumber"
                    label="Phone Number"
                  />
                  <AppTextField
                    onChangeText={handleChange("email")}
                    name="email"
                    label="Email Address"
                  />
                  <AppPicker
                    label="Gender"
                    options={genderOptions}
                    placeholder="Select Gender"
                    onValueChange={(value) => {
                      setFieldValue("gender", value);
                      if (typeof setFieldTouched === "function")
                        setFieldTouched("gender", true);
                    }}
                    value={values.gender}
                  />
                  {touched.gender && errors?.gender && (
                    <StyledText
                      type="label"
                      color={Colors.error}
                      variant="semibold"
                      style={{ marginBottom: 10 }}
                    >
                      {errors?.gender}
                    </StyledText>
                  )}
                  <Field
                    name="dob"
                    component={DatePicker}
                    label="Date of Birth"
                    dateFormat="MM/dd/yyyy"
                    minimumDate={new Date()}
                    placeholder="Select Date of Birth"
                  />
                  <AppTextField
                    onChangeText={handleChange("password")}
                    name="password"
                    label="Password"
                    isPassword={true}
                    secureTextEntry={hidePassword}
                  />
                  <AppTextField
                    onChangeText={handleChange("confirmPassword")}
                    name="confirmPassword"
                    label="Confirm Password"
                    isPassword={true}
                    secureTextEntry={hidePassword}
                  />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <AppTextField
                    onChangeText={handleChange("address")}
                    name="address"
                    label="Address"
                  />
                  <AppTextField
                    onChangeText={handleChange("city")}
                    name="city"
                    label="City"
                  />
                  <AppTextField
                    onChangeText={handleChange("state")}
                    name="state"
                    label="State"
                  />
                  <AppPicker
                    label="Country"
                    options={countries}
                    placeholder="Select Country"
                    onValueChange={(value) => setFieldValue("country", value)}
                    value={values.country}
                  />
                  {touched.country && errors?.country && (
                    <StyledText
                      type="label"
                      color={Colors.error}
                      variant="semibold"
                      style={{ marginBottom: 10 }}
                    >
                      {errors?.country}
                    </StyledText>
                  )}
                  <AppTextField
                    onChangeText={handleChange("nin")}
                    name="nin"
                    label="NIN (National Identification Number)"
                  />
                  <AppTextField
                    onChangeText={handleChange("bvn")}
                    name="bvn"
                    label="BVN (Bank Verification Number)"
                  />
                  <AppTextField
                    onChangeText={handleChange("referralCode")}
                    name="referralCode"
                    label="Referral Code"
                  />
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      value={values.agreedToTerms}
                      onValueChange={(value) =>
                        setFieldValue("agreedToTerms", value)
                      }
                      color={values.agreedToTerms ? Colors.primary : undefined}
                    />
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <StyledText style={{ marginLeft: 10 }}>
                        I agree to the{" "}
                      </StyledText>
                      <Pressable onPress={() => setIsTermsModalOpen(true)}>
                        <StyledText color={Colors.primary}>
                          Terms and Conditions
                        </StyledText>
                      </Pressable>
                    </View>
                  </View>
                  {touched.agreedToTerms && errors?.agreedToTerms && (
                    <StyledText
                      type="label"
                      color={Colors.error}
                      variant="semibold"
                      style={{ marginBottom: 10 }}
                    >
                      {errors?.agreedToTerms}
                    </StyledText>
                  )}
                </>
              )}
              <View style={styles.buttonContainer}>
                {currentStep === 2 && (
                  <AppButton
                    onPress={() => setCurrentStep(1)}
                    customStyles={styles.backButton}
                    textColor={Colors.primary}
                  >
                    Back
                  </AppButton>
                )}
                <AppButton
                  onPress={handleSubmit}
                  customStyles={{ marginTop: 15 }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.white}
                    />
                  ) : currentStep === 1 ? (
                    "Next"
                  ) : (
                    "Register"
                  )}
                </AppButton>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: 15,
                  }}
                >
                  <StyledText style={{ marginLeft: 10 }}>
                    By signing up, you agree to the{" "}
                  </StyledText>
                  <Pressable
                    onPress={() =>
                      Linking.openURL("https://utlam.com/privacy-policy/")
                    }
                  >
                    <StyledText color={Colors.primary}>
                      Terms of Use and Privacy Policy
                    </StyledText>
                  </Pressable>
                </View>
              </View>
              <StyledText style={{ marginTop: 20, textAlign: "center" }}>
                Already have an account{" "}
                <StyledText
                  color={Colors.primary}
                  onPress={() => router.replace("/(auth)/login")}
                >
                  Login
                </StyledText>
              </StyledText>
              <StyledText style={{ marginVertical: 20, textAlign: "center" }}>
                Existing User?{" "}
                <StyledText
                  color={Colors.primary}
                  onPress={() =>
                    router.replace("/(auth)/existing-user-registration")
                  }
                >
                  Register again
                </StyledText>
              </StyledText>
            </View>
          )}
        </Formik>
      </View>
      <Terms
        isModalVisible={isTermsModalOpen}
        setIsModalVisible={setIsTermsModalOpen}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: Colors.primary,
  },
  inactiveStep: {
    backgroundColor: Colors.light,
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: Colors.light,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // marginTop: 20,
  },
  backButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 15,
  },
  nextButton: {
    flex: 1,
  },
});

export default Register;
