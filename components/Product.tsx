import { StyleSheet, Text, Pressable, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Moneys, Calendar2 } from "iconsax-react-native";
import axios from "axios";
import { router } from "expo-router";

import { Colors } from "@/constants/Colors";
import StyledText from "./StyledText";
import AppDivider from "./AppDivider";
import { showMessage } from "react-native-flash-message";

const Product = ({ onPress, product }) => {
  const navigation = useNavigation();
  function convertToKebabCase(inputString) {
    inputString = inputString.trim();

    inputString = inputString.toLowerCase();

    inputString = inputString.replace(/\s+/g, "-");

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
  var imageUrl = products.includes(product.portfolioName)
    ? `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/${convertToKebabCase(
        product.portfolioName
      )}.webp?alt=media&token=9fbb64ae-96b9-49e1-`
    : `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/utlam-default.webp?alt=media&token=9fbb64ae-96b9-49e1-`;

  return (
    <Pressable
      onPress={() => {

        router.push({
          pathname:"/product-details", params: {
            header: product && product.portfolioName,
            headerImageUrl: imageUrl,
          }
        })
      }
      }
    >
      <View style={styles.container}>
        <Image
          src={imageUrl}
          style={styles.image}
        />
        <View style={styles.smallContainer}>
          <StyledText
            color={Colors.primary}
            type="body"
            variant="semibold"
            numberOfLines={2}
          >
            {product && product.portfolioName}
          </StyledText>
          <View>
            <AppDivider />
            <View
              style={[
                styles.flex,
                { flexWrap: "wrap", gap: 5, justifyContent: "space-between" },
              ]}
            >
              <View style={styles.flex}>
                <Moneys
                  size={16}
                  variant="Bold"
                  color={Colors.primary}
                />
                <StyledText
                  color={Colors.primary}
                  type="label"
                  variant="regular"
                >
                  <StyledText
                    type="label"
                    variant="semibold"
                  >
                    From ₦{product && product.minimumInvestment}
                  </StyledText>
                </StyledText>
              </View>

              <View style={styles.flex}>
                <Calendar2
                  size={16}
                  variant="Bold"
                  color={Colors.primary}
                />
                <StyledText
                  color={Colors.primary}
                  type="label"
                  variant="regular"
                >
                  Min{" "}
                  <StyledText
                    type="label"
                    variant="semibold"
                  >
                    {product && product.minimumHoldingPeriod} Days
                  </StyledText>
                </StyledText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: "row",
    height: 120,
    overflow: "hidden",
    marginVertical: 10,
    width: "100%",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallContainer: {
    justifyContent: "space-between",
    padding: 10,
    flex: 1,
  },
  image: {
    height: 120,
    width: 120,
  },
});

export default Product;
