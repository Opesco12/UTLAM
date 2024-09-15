import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Icon, Input, Button } from "@rneui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";

import { Colors } from "@/constants/Colors";
import AppTextField from "@/components/AppTextField";
import AppButton from "@/components/AppButton";
import AppHeader from "@/components/AppHeader";
import Screen from "@/components/Screen";
import StyledText from "@/components/StyledText";
import AppDatePicker from "@/components/AppDatePicker";
import AppPicker from "@/components/AppPicker";

import { registerNewIndividual, getCurrencies } from "../../api/index";
import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";

const Register = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [DOB, setDOB] = useState(null);
  const [gender, setGender] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [countries, setCountries] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);
  const statusBarHeight = StatusBar.currentHeight;

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .matches(/^[A-Za-z]+$/, "First name must contain only letters")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .required("First name is required"),
    lastname: Yup.string()
      .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .required("Last name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^[A-Za-z\d@$!%*?#&]+$/,
        "Password can only contain letters, numbers, and @$!%*#?&"
      )
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character (@$!%*?&#)"
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),

    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(50, "Address must not exceed 100 characters"),

    city: Yup.string()
      .required("City is required")
      .min(2, "City must be at least 2 characters")
      .max(50, "City must not exceed 50 characters"),

    state: Yup.string()
      .required("State is required")
      .min(2, "State must be at least 2 characters")
      .max(50, "State must not exceed 50 characters"),
  });

  const handlePress = async () => {};

  const genderOptions = [
    {
      label: "Male",
      value: "M",
    },
    { label: "Female", value: "F" },
  ];

  function formatDate(isoString) {
    const date = new Date(isoString);
    return [
      date.getUTCDate().toString().padStart(2, "0"),
      (date.getUTCMonth() + 1).toString().padStart(2, "0"),
      date.getUTCFullYear(),
    ].join("/");
  }

  useEffect(() => {
    axios
      .get("https://utl-proxy.vercel.app/api/v1/getcountries")
      .then((res) => {
        setCountries(
          res.data.map((country) => ({
            label: country.name,
            value: country.code,
          }))
        );
      })
      .catch((err) => console.error("Unable to fetch countries"));
  }, []);

  return (
    <Screen>
      <AppHeader />

      <View style={{ marginTop: 20 }}>
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

        <Formik
          validationSchema={validationSchema}
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
            clientType: 1,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
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
              clientType,
            } = values;

            axios
              .post(
                "https://utl-proxy.vercel.app/api/v1/registernewindividual",
                {
                  dateOfBirth: DOB.toISOString(),
                  emailAddress: email,
                  password: password,
                  firstName: firstname,
                  lastName: lastname,
                  phoneNo: phoneNumber,
                  clientType: clientType,
                  gender: gender,
                  address1: address,
                  city: city,
                  state: state,
                  country: userCountry,
                }
              )
              .then((res) => {
                setSubmitting(false);
                resetForm();
                if (res.status === 200) {
                  showMessage({
                    message: "You have successfully created an account",
                    type: "success",
                  });
                  router.replace({
                    pathname: "/(auth)/otp",
                    params: {
                      username: email,
                      header: "Activate account",
                    },
                  });
                }
              })
              .catch((err) => {
                setSubmitting(false);
                if (err.status === 400) {
                  showMessage({
                    message: `Email address ${email} or phone number has been used or is not available`,
                    type: "warning",
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
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <View style={{ marginTop: 20 }}>
              <AppTextField
                onChangeText={handleChange("firstname")}
                name="firstname"
                label={"First Name"}
              />
              <AppTextField
                onChangeText={handleChange("lastname")}
                name="lastname"
                label={"Last Name"}
              />
              <AppTextField
                onChangeText={handleChange("phoneNumber")}
                name="phoneNumber"
                label={"Phone Number"}
              />
              <AppTextField
                onChangeText={handleChange("email")}
                name="email"
                label={"Email Address"}
              />

              <AppPicker
                label={"Gender"}
                options={genderOptions}
                placeholder={"select Gender"}
                onValueChange={(value) => setGender(value)}
                value={gender}
              />

              <StyledText
                type="label"
                variant="medium"
                color={Colors.primary}
              >
                Date of Birth
              </StyledText>

              <AppButton
                onPress={() => setDatePickerVisibility(true)}
                customStyles={{
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderColor: Colors.light,
                  marginTop: 10,
                }}
                textColor={Colors.primary}
              >
                {DOB !== null ? formatDate(DOB) : "Select Date of Birth"}
              </AppButton>

              <AppTextField
                name={"address"}
                onChangeText={handleChange("address")}
                label={"Address"}
              />
              <AppTextField
                name={"city"}
                onChangeText={handleChange("city")}
                label={"City"}
              />
              <AppTextField
                name={"state"}
                onChangeText={handleChange("state")}
                label={"State"}
              />

              <AppPicker
                label={"Country"}
                options={countries}
                placeholder={"select Country"}
                onValueChange={(value) => setUserCountry(value)}
                value={userCountry}
              />

              <AppTextField
                onChangeText={handleChange("password")}
                name={"password"}
                label={"Password"}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setHidePassword(!hidePassword)}
                    color={Colors.light}
                  />
                }
                secureTextEntry={hidePassword ? true : false}
              />

              <AppTextField
                onChangeText={handleChange("confirmPassword")}
                name="confirmPassword"
                label={"Confirm Password"}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setHidePassword(!hidePassword)}
                    color={Colors.light}
                  />
                }
                secureTextEntry={hidePassword ? true : false}
              />

              <StyledText
                color={Colors.light}
                style={{ textAlign: "center", marginVertical: 20 }}
              >
                By Signing up, you agree to{" "}
                <StyledText color={Colors.primary}>
                  Terms of Use and Privacy Policy
                </StyledText>
              </StyledText>

              <AppButton
                onPress={() => {
                  if (userCountry === null || gender === null || DOB === null) {
                    showMessage({
                      message: "Please fill out all fields",
                      type: "warning",
                    });
                  }
                  handleSubmit();
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    size={"small"}
                    color={Colors.white}
                  />
                ) : (
                  "Proceed"
                )}
              </AppButton>

              <StyledText style={{ marginVertical: 20, textAlign: "center" }}>
                Already have an account{" "}
                <StyledText
                  color={Colors.primary}
                  onPress={() => router.replace("/(auth)/login")}
                >
                  Login
                </StyledText>
              </StyledText>
            </View>
          )}
        </Formik>
      </View>
      <AppDatePicker
        isDatePickerVisible={isDatePickerVisible}
        setDatePickerVisibility={setDatePickerVisibility}
        setDate={setDOB}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export default Register;
