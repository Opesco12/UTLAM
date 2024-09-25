import { View } from "react-native";
import { Formik } from "formik";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";

const ChangePassword = () => {
  return (
    <Screen>
      <AppHeader />
      <View style={{ marginVertical: 25 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Change Password
        </StyledText>
      </View>
    </Screen>
  );
};

export default ChangePassword;
