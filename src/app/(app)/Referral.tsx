import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";

import { getClientInfo } from "@/src/api";
import { Copy, CopySuccess } from "iconsax-react-native";
import { copyToClipboard } from "@/src/helperFunctions/copyToClipboard";
import { toast } from "sonner-native";

const Referral = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getClientInfo();
      setReferralCode(response?.referralCode);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleCopy = async (text) => {
    setCopied(true);
    await copyToClipboard(text);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <Screen>
      <AppHeader />
      <View style={{ marginTop: 25 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          Referral
        </StyledText>
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            size={"large"}
            color={Colors.primary}
          />
        </View>
      ) : (
        <View style={{ marginTop: 25 }}>
          <StyledText
            type="title"
            variant="semibold"
            color={Colors.primary}
          >
            Invite your friends! Share your referral code and earn rewards when
            they sign up.
          </StyledText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <StyledText
              type="subheading"
              variant="semibold"
              color={Colors.primary}
              style={{ marginTop: 10 }}
            >
              {referralCode}
            </StyledText>
            {copied ? (
              <CopySuccess
                size={25}
                color={Colors.primary}
              />
            ) : (
              <Copy
                size={25}
                color={Colors.primary}
                onPress={() => handleCopy(referralCode)}
              />
            )}
          </View>
        </View>
      )}
    </Screen>
  );
};

export default Referral;
