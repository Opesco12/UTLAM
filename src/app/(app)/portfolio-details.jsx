import { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ArrowCircleRight2, Money4, Moneys } from "iconsax-react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

import Screen from "@/src/components/Screen";
import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import ContentBox from "@/src/components/ContentBox";
import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";
import { showMessage } from "react-native-flash-message";
import { mutualfundRedemption } from "@/src/api";
import { useState } from "react";
import { Pressable } from "react-native";

const PorfolioDetails = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    header,
    headerImageUrl,
    product: productString,
    balance,
    portfolioId,
    accountNo,
    portfolioType,
  } = useLocalSearchParams();
  const product = JSON.parse(productString);

  const showWithdrawalAlert = async (accountNo, amount) => {
    Alert.alert(
      "Confirm Withdrawal",
      `Are you sure you want to withdraw ${amountFormatter.format(amount)}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Withdrawal cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => await handleWithdrawal(accountNo, amount),
        },
      ]
    );
  };

  const handleWithdrawal = async (accountNo, amount) => {
    setSubmitting(true);
    const data = await mutualfundRedemption(accountNo, amount);
    if (data) {
      setTimeout(() => {
        showMessage({
          position: "center",
          message: "Withdrawal Successful",
          description: `You have successfully withdrawn ₦${
            amount && amount
          } from ${header && header}`,
          style: {
            padding: 15,
          },
          textStyle: { fontSize: 18, textAlign: "center" },
          titleStyle: {
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
          },
          duration: 3000,
          renderCustomContent: () => (
            <LottieView
              autoPlay
              source={require("../../../assets/animations/success.json")}
              style={{
                height: 200,
                width: 200,
                alignSelf: "center",
              }}
              loop={false}
            />
          ),
        });
        router.replace("/(tabs)/");
      }, 2000);
      setSubmitting(false);
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .moreThan(999, "Please input an amount of at least 1000"),
  });

  useEffect(() => {
    if (portfolioType) {
    }
  }, []);

  const formatDate = (date) => {
    const newDate = new Date(date).toDateString();
    return newDate;
  };

  return (
    <LayeredScreen
      headerImageUrl={headerImageUrl}
      headerText={header}
      overlay={true}
    >
      <View style={styles.container}>
        <ContentBox
          customStyles={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0,
            marginVertical: 20,
            backgroundColor: Colors.white,
          }}
        >
          <View style={[styles.flex, { gap: 10 }]}>
            <Money4
              color={Colors.primary}
              size={25}
              variant="Bold"
            />
            <StyledText
              type="title"
              variant="medium"
              color={Colors.primary}
            >
              Total Investment Balance
            </StyledText>
          </View>
          <StyledText
            type="heading"
            variant="semibold"
            color={Colors.primary}
            style={{
              textAlign: "center",
            }}
          >
            {amountFormatter.format(balance)}
          </StyledText>
          <StyledText
            type="label"
            style={{ marginTop: 10 }}
          >
            Pending Dividend:{" "}
            {amountFormatter.format(product?.pendingDividendAmount)}
          </StyledText>
        </ContentBox>

        {!portfolioType && (
          <View>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(app)/Mutualfund-statement",
                  params: { header, headerImageUrl, balance },
                })
              }
            >
              <StyledText
                style={{ textAlign: "center", marginVertical: 15 }}
                color={Colors.primary}
              >
                View Statement
              </StyledText>
            </Pressable>
            <Formik
              validationSchema={validationSchema}
              initialValues={{ amount: 0 }}
              onSubmit={async (values) => {
                setSubmitting(true);
                const { amount } = values;
                if (Number(amount) > Number(balance)) {
                  showMessage({
                    message:
                      "Your Investment balance is insufficient for this transaction",
                    type: "warning",
                  });
                  setSubmitting(false);
                } else {
                  showWithdrawalAlert(accountNo, amount);
                }
              }}
            >
              {({ handleChange, handleSubmit }) => (
                <ContentBox customStyles={{ backgroundColor: Colors.white }}>
                  <StyledText
                    type="subheading"
                    variant="semibold"
                    color={Colors.primary}
                    style={{ textAlign: "center", marginBottom: 25 }}
                  >
                    Withdraw Funds
                  </StyledText>
                  <AppTextField
                    label={"Amount to withdraw"}
                    name={"amount"}
                    onChangeText={handleChange("amount")}
                    leftIcon={
                      <StyledText
                        type="subheading"
                        variant="semibold"
                        color={Colors.primary}
                      >
                        ₦
                      </StyledText>
                    }
                    leftIconContainerStyle={{ marginLeft: 10 }}
                    keyboardType="numeric"
                  />
                  <AppButton
                    customStyles={{ marginTop: 20 }}
                    onPress={handleSubmit}
                  >
                    {submitting === true ? (
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.white}
                      />
                    ) : (
                      "Withdraw"
                    )}
                  </AppButton>
                </ContentBox>
              )}
            </Formik>
          </View>
        )}
        {portfolioType && (
          <ContentBox
            customStyles={{ borderWidth: 0, backgroundColor: Colors.white }}
          >
            {product?.investments?.map((investment, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  router.push({
                    pathname: "/(app)/fixed-income-withdrawal",
                    params: {
                      header,
                      headerImageUrl,
                      productString,
                      balance,
                      investment: JSON.stringify(investment),
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Moneys
                        color={Colors.primary}
                        size={20}
                        variant="Bold"
                      />
                      <StyledText
                        type="title"
                        variant="medium"
                        color={Colors.primary}
                        style={{ fontSize: 19 }}
                      >
                        {amountFormatter.format(investment.currentValue)}
                      </StyledText>
                    </View>
                    <StyledText
                      type="label"
                      variant="semibold"
                      color={Colors.light}
                    >
                      Maturity Date: {formatDate(investment.maturityDate)}
                    </StyledText>
                  </View>
                  <ArrowCircleRight2
                    color={Colors.primary}
                    size={35}
                    variant="Bold"
                  />
                </View>
              </Pressable>
            ))}
          </ContentBox>
        )}
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PorfolioDetails;
