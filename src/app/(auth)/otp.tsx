import { View, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { showMessage } from "react-native-flash-message";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppButton from "@/src/components/AppButton";
import OtpInput from "@/src/components/Otp_Input";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import { activateAccount, login2fa, resendActivationCode } from "@/src/api";
import { storeUserData } from "@/src/storage/userData";
import { obfuscateEmail } from "@/src/helperFunctions/obfuscateEmail";
import { useAuth } from "@/context/authContext";

const OTP_LENGTH = 6;

const Otp = () => {
  const { username, header } = useLocalSearchParams<{
    username: string;
    header?: string;
  }>();
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const shortenedEmail = username ? obfuscateEmail(username) : "";

  const handleResendCode = useCallback(async () => {
    if (!username) return;
    try {
      const response = await resendActivationCode({ userName: username });
      if (response) {
        showMessage({
          message: "Security code has been sent to your email",
          type: "success",
        });
      }
    } catch (error) {
      showMessage({
        message: "Failed to resend security code",
        type: "danger",
      });
    }
  }, [username]);

  const handleSubmit = useCallback(async () => {
    if (code.join("").length < OTP_LENGTH) return;

    setIsIncorrect(false);
    const securityCode = code.join("");
    const data = { username, securityCode };

    try {
      let response;
      if (header) {
        response = await activateAccount(data);
        if (response) {
          toast.success("Account activated successfully");
          router.replace("/login");
        }
      } else {
        response = await login2fa(data);
        console.log(response);
        if (response) {
          toast.success("Login Successful");
          router.replace("/(tabs)/");
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      setIsIncorrect(true);
      toast.error("Invalid Security Code");
    }
  }, [code, username, header, setIsAuthenticated]);

  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={styles.header}
      >
        {header || "OTP Verification"}
      </StyledText>
      <StyledText
        type="body"
        variant="medium"
        color={Colors.light}
      >
        We have sent a security code to your email address {shortenedEmail}.
        Enter the code below to verify
      </StyledText>
      <View style={styles.content}>
        <OtpInput
          code={code}
          setCode={setCode}
          isIncorrect={isIncorrect}
        />

        {header && (
          <View style={styles.resendContainer}>
            <StyledText
              type="body"
              variant="medium"
              style={styles.resendText}
            >
              Didn't receive a code?
            </StyledText>
            <StyledText
              color={Colors.lightPrimary}
              type="body"
              variant="medium"
              style={styles.resendLink}
              onPress={handleResendCode}
            >
              Resend Security Code
            </StyledText>
          </View>
        )}

        <AppButton
          onPress={handleSubmit}
          disabled={code.join("").length < OTP_LENGTH}
          customStyles={styles.button}
        >
          Continue
        </AppButton>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  content: {
    marginTop: 25,
    flex: 1,
  },
  resendContainer: {
    marginTop: 25,
    marginBottom: 50,
    alignItems: "center",
  },
  resendText: {
    textAlign: "center",
  },
  resendLink: {
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 50,
  },
});

export default Otp;
