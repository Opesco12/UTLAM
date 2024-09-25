import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Screen from "@/src/components/Screen";
import AppButton from "@/src/components/AppButton";
import { Colors } from "@/src/constants/Colors";

const Onboarding = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.help}>
          <AntDesign
            name="questioncircle"
            color={Colors.primary}
            size={18}
          />
          <Text style={{ fontSize: 16, color: Colors.primary }}>Help</Text>
        </View>

        <View style={styles.buttons}>
          <AppButton text={"Create Account"} />
          <AppButton
            text={"Log into your account"}
            textColor={Colors.primary}
            customStyles={{ backgroundColor: Colors.white }}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  help: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default Onboarding;
