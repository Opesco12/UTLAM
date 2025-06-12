import React, { useRef } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Colors } from "@/src/constants/Colors";

const Otp_Input = ({
  codeLength = 6,
  onCodeFilled,
  code,
  setCode,
  isIncorrect,
}) => {
  const inputRefs = useRef([]);

  const handlePaste = async (index) => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent) {
        const validPastedData = clipboardContent
          .replace(/\D/g, "")
          .slice(0, codeLength);
        if (validPastedData.length > 0) {
          const newCode = [...code];
          for (
            let i = 0;
            i < validPastedData.length && index + i < codeLength;
            i++
          ) {
            newCode[index + i] = validPastedData[i];
          }
          setCode(newCode);
          const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
          const focusIndex =
            nextEmptyIndex === -1 ? codeLength - 1 : nextEmptyIndex;
          inputRefs.current[focusIndex]?.focus();
          if (newCode.every((digit) => digit !== "")) {
            onCodeFilled?.(newCode.join(""));
          }
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleLongPress = () => {
    Alert.alert("Paste", "Do you want to paste from clipboard?", [
      { text: "Cancel", style: "cancel" },
      { text: "Paste", onPress: () => handlePaste(0) },
    ]);
  };

  const handleChange = (text, index) => {
    if (text.length > 1) {
      const validPastedData = text
        .replace(/\D/g, "")
        .slice(0, codeLength - index);
      if (validPastedData.length > 0) {
        const newCode = [...code];
        for (
          let i = 0;
          i < validPastedData.length && index + i < codeLength;
          i++
        ) {
          newCode[index + i] = validPastedData[i];
        }
        setCode(newCode);
        const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
        const focusIndex =
          nextEmptyIndex === -1 ? codeLength - 1 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
        if (newCode.every((digit) => digit !== "")) {
          onCodeFilled?.(newCode.join(""));
        }
        return;
      }
    }
    if (text && !/^\d$/.test(text)) {
      return;
    }
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.every((digit) => digit !== "")) {
      onCodeFilled?.(newCode.join(""));
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          secureTextEntry
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            { borderColor: isIncorrect ? Colors.error : Colors.light },
          ]}
          keyboardType="numeric"
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          onLongPress={handleLongPress}
          selectTextOnFocus
          contextMenuHidden={false}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 20,
    height: 43,
    textAlign: "center",
    width: 43,
    color: Colors.black,
  },
});

export default Otp_Input;
