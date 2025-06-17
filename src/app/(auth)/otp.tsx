import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppButton from "@/src/components/AppButton";
import OtpInput from "@/src/components/Otp_Input";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import { obfuscateEmail } from "@/src/helperFunctions/obfuscateEmail";

import { useAuth } from "@/context/authContext";

import { activateAccount, login2fa, resnedActivationCode } from "@/src/api";

const OTP_LENGTH = 6;

const Otp = () => {
  const { username, header, from } = useLocalSearchParams<{
    username: string;
    header?: string;
    from?: string;
  }>();
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const shortenedEmail = username ? obfuscateEmail(username) : "";
  const isActivation = !!header;

  const handleResendCode = useCallback(async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const response = await resnedActivationCode({ userName: username });
      if (response) {
        toast.success("Security code has been sent to your email");
      }
    } catch (error) {
      toast.error("Failed to resend activation code");
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const handleSubmit = useCallback(async () => {
    if (code.join("").length < OTP_LENGTH) return;
    setIsLoading(true);
    setIsIncorrect(false);
    const securityCode = code.join("");
    const data = { username, securityCode };

    try {
      if (isActivation) {
        const response = await activateAccount(data);
        if (response) {
          toast.success("Your account has been successfully activated");
          router.replace("/login");
        }
      } else {
        const response = await login2fa(data);
        if (response) {
          toast.success("Login Successful");
          setIsAuthenticated(true);
          router.replace("/(tabs)/");
        }
      }
    } catch (error) {
      setIsIncorrect(true);
      toast.error("Invalid Security Code");
    } finally {
      setIsLoading(false);
    }
  }, [code, username, isActivation, setIsAuthenticated, from]);

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

        {isActivation && (
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
          disabled={isLoading || code.join("").length < OTP_LENGTH}
          customStyles={styles.button}
        >
          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={Colors.white}
            />
          ) : (
            "Continue"
          )}
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
