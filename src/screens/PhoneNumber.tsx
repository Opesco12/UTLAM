import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import AppLargeText from "@/src/components/AppLargeText";
import AppButton from "@/src/components/AppButton";

const PhoneNumber = () => {
  return (
    <Screen>
      <AppHeader />
      <AppLargeText text={"Phone Number"} />

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: 5,
          marginVertical: 25,
        }}
      >
        <Feather
          name="smartphone"
          size={20}
        />
        <Text style={{ fontSize: 18 }}>***********10</Text>
      </View>

      <AppButton
        text={"Add a phone number"}
        customStyles={{ marginTop: 20 }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default PhoneNumber;
