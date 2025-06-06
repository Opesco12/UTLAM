import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Moneys, ArrowCircleRight2, TrendUp } from "iconsax-react-native";
import { router } from "expo-router";

import ContentBox from "./ContentBox";
import StyledText from "./StyledText";
import { Colors } from "../constants/Colors";

import { amountFormatter } from "../helperFunctions/amountFormatter";

const PortfolioListItem = ({ product }) => {
  const [fixedIncomeBalance, setFixedIncomeBalance] = useState(0);
  function convertToKebabCase(inputString) {
    inputString = inputString?.trim();

    inputString = inputString?.toLowerCase();

    inputString = inputString?.replace(/\s+/g, "-");

    return inputString;
  }
  const products = [
    "UTLAM MONEY MARKET PLAN",
    "UTLAM LIFESTYLE ACCOUNT",
    "UTLAM LIQUIDITY MANAGER",
    "UTLAM TARGET SAVINGS",
    "UTLAM FIXED INCOME STRATEGY",
    "UTLAM BALANCED STRATEGY",
    "UTLAM GROWTH STRATEGY",
    "UTLAM FIXED INCOME PLAN",
    "UTLAM BALANCE PLAN",
    "UTLAM GROWTH PLAN",
  ];

  var imageUrl = products.includes(product.portfolio)
    ? `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/${convertToKebabCase(
        product.portfolio
      )}.webp?alt=media&token=9fbb64ae-96b9-49e1-`
    : `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/utlam-default.webp?alt=media&token=9fbb64ae-96b9-49e1-`;
  useEffect(() => {
    if (product.portfolioType === 9) {
      var balance = 0;
      product.investments?.map(
        (investment) => (balance += investment.currentValue)
      );

      setFixedIncomeBalance(balance);
    }
  }, []);

  return (
    <ContentBox
      customStyles={{
        alignItems: "center",
        backgroundColor: Colors.white,
        borderWidth: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 0,
      }}
      onPress={() => {
        if (product.portfolio !== "Wallet") {
          router.push({
            pathname: "/(app)/portfolio-details",
            params: {
              header: product?.portfolio,
              headerImageUrl: imageUrl,
              product: JSON.stringify(product),
              portfolioId: product.portfolioId,
              portfolioType: product.portfolioType,
              accountNo: product?.mutualfundAccountNo,
              balance:
                product.portfolioType === 9
                  ? fixedIncomeBalance
                  : product.balance,
            },
          });
        }
      }}
    >
      <View style={[styles.flex, { gap: 20 }]}>
        <TrendUp
          color={Colors.secondary}
          size={35}
          variant="Bold"
        />
        <View style={{}}>
          <StyledText
            type="title"
            variant="semibold"
            color={Colors.primary}
          >
            {product?.portfolio}
          </StyledText>
          {product.portfolioType !== 9 && product?.portfolio !== "Wallet" && (
            <StyledText
              type="label"
              color={Colors.light}
            >
              Pending Dividend:{" "}
              {amountFormatter.format(product?.pendingDividendAmount)}
            </StyledText>
          )}
          <View style={[styles.flex, { gap: 10 }]}>
            <Moneys
              color={Colors.primary}
              size={20}
              variant="Bold"
            />

            <StyledText
              type="title"
              variant="semibold"
              color={Colors.light}
            >
              {product ? (
                product.portfolioType === 9 ? (
                  amountFormatter.format(fixedIncomeBalance)
                ) : (
                  amountFormatter.format(product.balance)
                )
              ) : (
                <ActivityIndicator
                  size={"small"}
                  color={Colors.primary}
                />
              )}
            </StyledText>
          </View>
        </View>
      </View>
      <ArrowCircleRight2
        color={Colors.primary}
        size={35}
        variant="Bold"
      />
    </ContentBox>
  );
};

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PortfolioListItem;
