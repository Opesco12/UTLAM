import { View, Text } from "react-native";
import { Call, Copy, CopySuccess, Message } from "iconsax-react-native";

import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import Screen from "@/src/components/Screen";
import { Colors } from "@/src/constants/Colors";
import { useState } from "react";
import { copyToClipboard } from "@/src/helperFunctions/copyToClipboard";

const Support = () => {
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isNumberCopied, setIsNumberCopied] = useState(false);

  const handleEmailCopy = async () => {
    setIsEmailCopied(true);
    await copyToClipboard("support@utlam.com");
    setTimeout(() => {
      setIsEmailCopied(false);
    }, 3000);
  };

  const handleNumberCopy = async () => {
    setIsNumberCopied(true);
    await copyToClipboard("09030289111");
    setTimeout(() => {
      setIsNumberCopied(false);
    }, 3000);
  };

  return (
    <Screen>
      <AppHeader />

      <View style={{ marginTop: 20 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Help & Support
        </StyledText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 30,
          }}
        >
          <StyledText
            type="title"
            variant="semibold"
            color={Colors.primary}
          >
            Email Address: support@utlam.com
          </StyledText>
          {isEmailCopied ? (
            <CopySuccess
              size={25}
              color={Colors.primary}
            />
          ) : (
            <Copy
              size={25}
              color={Colors.primary}
              onPress={handleEmailCopy}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 20,
          }}
        >
          <StyledText
            type="title"
            variant="semibold"
            color={Colors.primary}
          >
            Telephone Number: (+234) 903 - 0289 - 111
          </StyledText>
          {isNumberCopied ? (
            <CopySuccess
              size={25}
              color={Colors.primary}
            />
          ) : (
            <Copy
              size={25}
              color={Colors.primary}
              onPress={handleNumberCopy}
            />
          )}
        </View>
      </View>
    </Screen>
  );
};

export default Support;
