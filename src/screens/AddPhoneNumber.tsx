import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import Modal from "react-native-modal";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppLargeText from "@/src/components/AppLargeText";
import { Colors } from "@/src/constants/Colors";
import AppButton from "@/src/components/AppButton";
import AppDropdown from "@/src/components/AppDropdown";
import AppModal from "@/src/components/AppModal";

const AddPhoneNumber = () => {
  const options = [
    { label: "234", value: "234" },
    { label: "447", value: "447" },
    { label: "245", value: "245" },
    { label: "245", value: "245" },
    { label: "245", value: "245" },
    { label: "245", value: "245" },
    { label: "245", value: "245" },
  ];

  const handleSelect = (option) => {
    console.log("Selected:", option);
  };
  return (
    <Screen>
      <AppHeader />
      <AppLargeText text={"Add phone number"} />
      <Text style={styles.text}>
        Input the number you would like to add to your account
      </Text>

      <View style={{ flexDirection: "row", gap: 5, marginTop: 30 }}>
        <AppDropdown
          options={options}
          onSelect={handleSelect}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
        />
      </View>
    </Screen>
  );
};

const PhoneNumberVerification = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <AppLargeText text={"2 Step Verification"} />
        <Text style={styles.text}>
          Enter the 2-step verification code we sent to your phone number
          ********10
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter 7 digit code"
          />
        </View>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <AppButton text={"Submit"} />
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        style={{
          margin: 0,
        }}
      >
        <TouchableOpacity style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>
              The number *********10 has already been added to your account
            </Text>

            <AppButton
              text={"Dismiss"}
              customStyles={{ backgroundColor: "#eff5f7", marginTop: 50 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
    height: 50,
    padding: 8,
  },
  inputContainer: {
    marginTop: 50,
  },
  text: {
    fontSize: 16,
    color: Colors.light,
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: 250,
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
});

export { AddPhoneNumber, PhoneNumberVerification };
