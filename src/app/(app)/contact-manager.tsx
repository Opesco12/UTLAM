import { View } from "react-native";

import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import Screen from "@/src/components/Screen";
import Textarea from "@/src/components/AppTextArea";
import { useState } from "react";
import AppButton from "@/src/components/AppButton";

const ContactManager = () => {
  const [text, setText] = useState("");
  return (
    <Screen>
      <AppHeader />

      <View style={{ marginTop: 20 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Contact Account Manager
        </StyledText>
      </View>

      <View style={{ marginTop: 30 }}>
        <Textarea
          value={text}
          onChangeText={setText}
          placeholder="Write out a detailed message..."
          maxLength={500}
          rows={6}
          // error={text.length === 0 ? "This field is required" : null}
        />
      </View>
      <AppButton customStyles={{ marginTop: 15 }}>Send Message</AppButton>
    </Screen>
  );
};

export default ContactManager;
