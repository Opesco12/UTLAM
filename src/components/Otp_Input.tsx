import { StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useRef } from "react";

import { Colors } from "@/src/constants/Colors";

const Otp_Input = ({
  codeLength = 6,
  onCodeFilled,
  code,
  setCode,
  isIncorrect,
}) => {
  // const [code, setCode] = useState(Array(codeLength).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if current input is filled
    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onCodeFilled when all inputs are filled
    if (newCode.every((digit) => digit !== "")) {
      onCodeFilled && onCodeFilled(newCode.join(""));
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // console.log(code.join(""))
  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            { borderColor: isIncorrect ? Colors.error : Colors.light },
          ]}
          maxLength={1}
          keyboardType="numeric"
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
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
  },
});

export default Otp_Input;
