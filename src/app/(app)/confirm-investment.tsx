import { ActivityIndicator, StyleSheet, View, Switch } from "react-native";
import { useState } from "react";
import { toast } from "sonner-native";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from "expo-router";

import LayeredScreen from "@/src/components/LayeredScreen";
import ContentBox from "@/src/components/ContentBox";
import AppDivider from "@/src/components/AppDivider";
import { Colors } from "@/src/constants/Colors";
import AppButton from "@/src/components/AppButton";
import StyledText from "@/src/components/StyledText";
import { amountFormatter } from "@/src/helperFunctions/amountFormatter";

import {
  fixedIncomeSubscriptionOrder,
  mutualFundSubscription,
} from "@/src/api";

const ConfirmInvestment = () => {
  const {
    amount,
    header,
    headerImageUrl,
    portfolioId,
    portfolioTypeName,
    securityId,
    tenor,
  } = useLocalSearchParams();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const makeInvestment = async ({ amount, portfolioId, portfolioTypeName }) => {
    setLoading(true);
    if (portfolioTypeName === "mutualfund") {
      const data = await mutualFundSubscription({
        amount: amount,
        portfolioId: portfolioId,
      });
      setLoading(false);
      return data;
    } else {
      const data = await fixedIncomeSubscriptionOrder({
        faceValue: amount,
        currency: "NGN",
        portfolioId: portfolioId,
        securityProductId: securityId,
        tenor: tenor,
      });
      setLoading(false);
      return data;
    }
  };

  return (
    <LayeredScreen
      headerImageUrl={headerImageUrl && headerImageUrl}
      headerText={header && header}
      overlay={true}
      customStyles={{ paddingHorizontal: 0 }}
    >
      <View style={styles.container}>
        {showAnimation && (
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay
              source={require("../../../assets/animations/success.json")}
              style={{
                height: 200,
                width: 200,
                alignSelf: "center",
              }}
              loop={false}
              onAnimationFinish={() => {
                setShowAnimation(false);
                router.replace("/(tabs)/");
              }}
            />
          </View>
        )}
        <ContentBox
          customStyles={{
            borderWidth: 0,
            backgroundColor: Colors.white,
            elelvation: 2,
            marginTop: 20,
          }}
        >
          <StyledText
            color={Colors.primary}
            type="title"
            variant="semibold"
          >
            Confirm Investment
          </StyledText>

          <ContentBox customStyles={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <StyledText
                color={Colors.light}
                type="body"
                variant="regular"
              >
                Amount
              </StyledText>
              <StyledText
                color={Colors.primary}
                type="subheading"
                variant="semibold"
              >
                {amount && amountFormatter.format(amount)}
              </StyledText>
            </View>
          </ContentBox>

          <StyledText
            color={Colors.light}
            type="body"
            variant="medium"
          >
            By tapping on the "Make Payment" button, you agree to have the Total
            Due deducted from your Wallet Balannce to create this investment
            plan.
          </StyledText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              gap: 10,
            }}
          >
            <Switch
              value={agreeToTerms}
              onValueChange={() => setAgreeToTerms(!agreeToTerms)}
            />
            <StyledText
              type="body"
              variant="medium"
              color={Colors.light}
            >
              Yes, I agree to the terms above
            </StyledText>
          </View>
          <AppButton
            disabled={!agreeToTerms || loading}
            customStyles={{ marginTop: 20 }}
            onPress={async () => {
              try {
                const data = await makeInvestment({
                  amount: amount,
                  portfolioId: portfolioId,
                  portfolioTypeName: portfolioTypeName,
                });
                if (data) {
                  toast.success("Investment Successful", {
                    description: `You have successfully invested ₦${
                      amount && amount
                    } in ${header && header}`,
                    duration: 3000,
                    style: {
                      padding: 15,
                      alignItems: "center",
                    },
                    richColors: true,
                  });
                  setShowAnimation(true);
                }
              } catch (err) {
                console.log(err);
                toast.error("Investment Failed", {
                  description:
                    "An error occurred while processing your investment",
                  duration: 3000,
                  style: {
                    padding: 15,
                    alignItems: "center",
                  },
                  richColors: true,
                });
                setLoading(false);
              }
            }}
          >
            {loading ? <ActivityIndicator size={"small"} /> : "Make Payment"}
          </AppButton>
        </ContentBox>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBg,
    flex: 1,
    paddingHorizontal: 15,
  },
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default ConfirmInvestment;
