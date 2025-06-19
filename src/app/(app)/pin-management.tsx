import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { toast } from "sonner-native";
import { Key, Lock } from "iconsax-react-native";

import { Colors } from "@/src/constants/Colors";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import Screen from "@/src/components/Screen";
import Otp_Input from "@/src/components/Otp_Input";

import {
  changeTransactionPin,
  createTransactionPin,
  getClientInfo,
  getWalletBalance,
  hasTransactionPin,
  resetTransactionPin,
  resetTransactionPinRequest,
} from "../../api/index";
import AppListItem from "@/src/components/AppListItem";

const PinManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasTransactionPin, setUserHasTransactionPin] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("create");

  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [oldPin, setOldPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmNewPin, setConfirmNewPin] = useState(["", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [resetNewPin, setResetNewPin] = useState(["", "", "", ""]);
  const [resetConfirmPin, setResetConfirmPin] = useState(["", "", "", ""]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pinResponse, balanceResponse, clientInfo] = await Promise.all([
          hasTransactionPin(),
          getWalletBalance(),
          getClientInfo(),
        ]);
        console.log(balanceResponse);
        setUserHasTransactionPin(pinResponse?.status !== false);
        setWalletBalance(balanceResponse[0]);
        setClientInfo(clientInfo);
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const pinString = pin.join("");
    const confirmPinString = confirmPin.join("");

    if (pinString.length !== 4 || confirmPinString.length !== 4) {
      toast.error("Please enter all 4 digits");
      setIsSubmitting(false);
      return;
    }

    if (pinString !== confirmPinString) {
      toast.error("PINs do not match");
      setIsSubmitting(false);
      return;
    }

    if (pinString.startsWith("0")) {
      toast.error("PIN cannot start with zero");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      accountNo: walletBalance?.walletAccountNo,
      transactionPin: Number(pinString),
    };

    try {
      const response = await createTransactionPin(requestData);
      if (response?.status === true) {
        toast.success("Successfully created transaction PIN");
        setUserHasTransactionPin(true);
        setPin(["", "", "", ""]);
        setConfirmPin(["", "", "", ""]);
      } else {
        toast.error("Failed to create transaction PIN");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const handleChangePin = async () => {
    setIsSubmitting(true);
    console.log(oldPin, newPin);
    const oldPinString = oldPin.join("");
    const newPinString = newPin.join("");
    const confirmNewPinString = confirmNewPin.join("");

    if (
      oldPinString.length !== 4 ||
      newPinString.length !== 4 ||
      confirmNewPinString.length !== 4
    ) {
      toast.error("Please enter all 4 digits for all fields");
      setIsSubmitting(false);
      return;
    }

    if (newPinString !== confirmNewPinString) {
      toast.error("New PINs do not match");
      setIsSubmitting(false);
      return;
    }

    if (oldPinString === newPinString) {
      toast.error("New PIN must be different from old PIN");
      setIsSubmitting(false);
      return;
    }

    if (newPinString.startsWith("0")) {
      toast.error("PIN cannot start with zero");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      oldPassword: Number(oldPinString),
      newPassword: Number(newPinString),
    };

    try {
      const response = await changeTransactionPin(requestData);
      if (response?.status === true) {
        toast.success("Successfully changed transaction PIN");
        setActiveSection("create");
        setOldPin(["", "", "", ""]);
        setNewPin(["", "", "", ""]);
        setConfirmNewPin(["", "", "", ""]);
      } else {
        toast.error("Failed to change transaction PIN");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMenuHidden(false);
    }

    setIsSubmitting(false);
  };

  const handleResetPin = async () => {
    setIsSubmitting(true);
    try {
      const response = await resetTransactionPinRequest(
        clientInfo?.emailAddress
      );
      if (response?.status === true) {
        toast.success(
          "PIN reset request sent successfully. Please check your email for the reset token."
        );
        setActiveSection("reset");
      } else {
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMenuHidden(true);
    }

    setIsSubmitting(false);
  };

  const handleCreateNewPin = async () => {
    setIsSubmitting(true);
    const newPinString = resetNewPin.join("");
    const confirmPinString = resetConfirmPin.join("");

    if (!resetToken.trim()) {
      toast.error("Please enter the reset token");
      setIsSubmitting(false);
      return;
    }

    if (newPinString.length !== 4 || confirmPinString.length !== 4) {
      toast.error("Please enter all 4 digits for PIN fields");
      setIsSubmitting(false);
      return;
    }

    if (newPinString !== confirmPinString) {
      toast.error("New PINS do not match");
      setIsSubmitting(false);
      return;
    }

    if (newPinString.startsWith("0")) {
      toast.error("PIN cannot start with zero");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      token: resetToken,
      newTransactionPin: Number(newPinString),
    };

    try {
      const response = await resetTransactionPin(requestData);
      if (response?.status === true) {
        toast.success("Successfully reset transaction PIN");
        setUserHasTransactionPin(true);
        setActiveSection("create");
        setResetToken("");
        setResetNewPin(["", "", "", ""]);
        setResetConfirmPin(["", "", "", ""]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMenuHidden(false);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Screen>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader />
      <View style={styles.headerContainer}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Pin Management
        </StyledText>
      </View>
      {isMenuHidden === false && (
        <View style={styles.menuContainer}>
          {userHasTransactionPin && (
            <>
              <AppListItem
                onPress={() => {
                  setActiveSection("change");
                  setIsMenuHidden(true);
                }}
                leftIcon={
                  <Lock
                    size={20}
                    color={Colors.primary}
                  />
                }
              >
                Change PIN
              </AppListItem>

              <AppListItem
                onPress={handleResetPin}
                leftIcon={
                  <Lock
                    size={20}
                    color={Colors.primary}
                  />
                }
              >
                Reset PIN
              </AppListItem>
            </>
          )}
        </View>
      )}

      {activeSection === "create" && !userHasTransactionPin && (
        <View style={styles.sectionContainer}>
          <StyledText
            type="title"
            variant="bold"
            style={styles.sectionTitle}
          >
            Create PIN
          </StyledText>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter PIN</Text>
            <Otp_Input
              codeLength={4}
              code={pin}
              setCode={setPin}
              onCodeFilled={(code) => setPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm PIN</Text>
            <Otp_Input
              codeLength={4}
              code={confirmPin}
              setCode={setConfirmPin}
              onCodeFilled={(code) => setConfirmPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <TouchableOpacity
            style={[
              {
                backgroundColor: Colors.primary,
                paddingVertical: 12,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              },
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />
            ) : (
              <Text style={styles.buttonText}>Confirm PIN</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {activeSection === "change" && (
        <View style={styles.sectionContainer}>
          <StyledText
            type="title"
            variant="bold"
            style={styles.sectionTitle}
          >
            Change PIN
          </StyledText>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Old PIN</Text>
            <Otp_Input
              codeLength={4}
              code={oldPin}
              setCode={setOldPin}
              onCodeFilled={(code) => setOldPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New PIN</Text>
            <Otp_Input
              codeLength={4}
              code={newPin}
              setCode={setNewPin}
              onCodeFilled={(code) => setNewPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New PIN</Text>
            <Otp_Input
              codeLength={4}
              code={confirmNewPin}
              setCode={setConfirmNewPin}
              onCodeFilled={(code) => setConfirmNewPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setActiveSection("create");
                setIsMenuHidden(false);
              }}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, { color: Colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleChangePin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.white}
                />
              ) : (
                <Text style={styles.buttonText}>Change PIN</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {activeSection === "reset" && (
        <View style={styles.sectionContainer}>
          <StyledText
            type="title"
            variant="bold"
            style={styles.sectionTitle}
          >
            Reset PIN
          </StyledText>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reset Token (from email)</Text>
            <TextInput
              style={styles.textInput}
              value={resetToken}
              onChangeText={setResetToken}
              placeholder="Enter reset token"
              placeholderTextColor={Colors.light}
              editable={!isSubmitting}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New PIN</Text>
            <Otp_Input
              codeLength={4}
              code={resetNewPin}
              setCode={setResetNewPin}
              onCodeFilled={(code) => setResetNewPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New PIN</Text>
            <Otp_Input
              codeLength={4}
              code={resetConfirmPin}
              setCode={setResetConfirmPin}
              onCodeFilled={(code) => setResetConfirmPin(code.split(""))}
              isIncorrect={false}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setActiveSection("create");
                setIsMenuHidden(false);
              }}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, { color: Colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleCreateNewPin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.white}
                />
              ) : (
                <Text style={styles.buttonText}>Create New PIN</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    marginTop: 25,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  menuContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  sectionContainer: {
    alignItems: "center",
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: Colors.light,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: Colors.black,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default PinManagement;
