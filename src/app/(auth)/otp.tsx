import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";
import Otp_Input from "@/src/components/Otp_Input";
import StyledText from "@/src/components/StyledText";

import { storeUserData } from "@/src/storage/userData";
import { obfuscateEmail } from "../../helperFunctions/obfuscateEmail";

const Otp = ({ route }) => {
  const { username, header } = useLocalSearchParams();
  const [code, setCode] = useState(Array(6).fill(""));
  const [isIncorrect, setIsIncorrect] = useState(false);

  const shortenedEmail = username && obfuscateEmail(username);

  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginTop: 25 }}
      >
        {header ? header : "OTP Verification"}
      </StyledText>
      <StyledText
        type="body"
        variant="medium"
        color={Colors.light}
      >
        We have sent a security code to your email address {shortenedEmail}{" "}
        Enter the code below to verify
      </StyledText>
      <View style={{ marginTop: 25, flex: 1 }}>
        <Otp_Input
          code={code}
          setCode={setCode}
          isIncorrect={isIncorrect}
        />

        {header && (
          <View style={{ marginTop: 25, marginBottom: 50 }}>
            <StyledText
              type="body"
              variant="medium"
              style={{ textAlign: "center" }}
            >
              Didn't receive a code?
            </StyledText>
            <StyledText
              color={Colors.lightPrimary}
              type="body"
              variant="medium"
              style={{
                marginTop: 10,
                textAlign: "center",
              }}
              onPress={() => {
                axios
                  .post(
                    "https://utl-proxy.vercel.app/api/v1/resendactivationcode",
                    { username: username, securityCode: `${code.join("")}` }
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      showMessage({
                        message: "Security code has been sent to your email",
                        type: "success",
                      });
                    }
                  })
                  .catch((err) => {
                    if (err.status === 400) {
                      showMessage({
                        message: "Incorrect Security Code",
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
              Resend Security Code
            </StyledText>
          </View>
        )}

        <AppButton
          onPress={() => {
            if (header) {
              axios
                .post("https://utl-proxy.vercel.app/api/v1/activateaccount", {
                  username: username,
                  securityCode: `${code.join("")}`,
                })
                .then((res) => {
                  if (res.status === 200) {
                    showMessage({
                      message: "Login Succesful",
                      type: "success",
                    });
                    router.replace("/(tabs)/");
                  }
                })
                .catch((err) => {
                  if (err.status === 400) {
                    setIsIncorrect(true);
                    showMessage({
                      message: "Incorrect Security Code",
                      type: "danger",
                    });
                  } else {
                    showMessage({
                      message: "Please try again later",
                      type: "warning",
                    });
                  }
                });
            } else {
              axios
                .post("https://utl-proxy.vercel.app/api/v1/login2fa", {
                  username: username,
                  securityCode: `${code.join("")}`,
                })
                .then((res) => {
                  if (res.status === 200) {
                    showMessage({
                      message: "Login Succesful",
                      type: "success",
                    });
                    console.log(res.data);
                    storeUserData(res.data);
                    router.replace("/(tabs)/");
                  }
                })
                .catch((err) => {
                  if (err.status === 400) {
                    showMessage({
                      message: "Incorrect Security Code",
                      type: "danger",
                    });
                  } else {
                    showMessage({
                      message: "Please try again later",
                      type: "warning",
                    });
                  }
                });
            }
          }}
          customStyles={{
            display: code.join("").length < 6 ? "none" : "flex",
            marginTop: 50,
          }}
        >
          Continue
        </AppButton>
      </View>
    </Screen>
  );
};

export default Otp;
