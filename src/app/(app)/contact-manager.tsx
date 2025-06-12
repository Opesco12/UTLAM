import { ActivityIndicator, View } from "react-native";

import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import Screen from "@/src/components/Screen";
import Textarea from "@/src/components/AppTextArea";
import { useState } from "react";
import AppButton from "@/src/components/AppButton";
import { sendMessageToClientManager } from "@/src/api";
import { toast } from "sonner-native";
import { Colors } from "@/src/constants/Colors";

const ContactManager = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log(text);
    const response = await sendMessageToClientManager(text);
    if (response) {
      setText("");
      toast.success("Message Sent Succesfully");
      setIsLoading(false);
    }
  };
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
        />
      </View>
      <AppButton
        customStyles={{ marginTop: 15 }}
        onPress={handleSubmit}
        disabled={isLoading || text.length < 10}
      >
        {isLoading ? (
          <ActivityIndicator
            size={"small"}
            color={Colors.white}
          />
        ) : (
          "Send Message"
        )}
      </AppButton>
    </Screen>
  );
};

export default ContactManager;
