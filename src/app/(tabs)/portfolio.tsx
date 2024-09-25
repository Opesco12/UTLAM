import { StyleSheet, Image, Text, View } from "react-native";
import {
  ArrowCircleRight2,
  Money4,
  Moneys,
  TrendUp,
} from "iconsax-react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "expo-router";

import Screen from "@/src/components/Screen";
import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import ContentBox from "@/src/components/ContentBox";

import { retrieveUserData } from "@/src/storage/userData";
import { amountFormatter } from "../../helperFunctions/amountFormatter";
import {
  getClientPortfolio,
  getMutualFundOnlineBalances,
  getWalletBalance,
} from "../../api/index";
import Loader from "@/src/components/Loader";

const PortfolioList = ({ product }) => {
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
              {amountFormatter.format(product?.holding)}
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

const Portfolio = () => {
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    amount: 0,
  });
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await retrieveUserData();

      const userBalance = await getWalletBalance();
      setUserBalance({
        currencyCode: userBalance[0].currencyCode,
        amount: userBalance[0].amount,
      });

      const userPortfolio = await getMutualFundOnlineBalances();
      setPortfolio(userPortfolio);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <LayeredScreen headerText={"My Portfolio"}>
      {loading ? (
        <Loader />
      ) : (
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
                variant="regular"
                color={Colors.primary}
              >
                Total Portfolio Balance
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
              {userBalance && amountFormatter.format(userBalance.amount)}
            </StyledText>
          </ContentBox>

          <ContentBox
            customStyles={{ borderWidth: 0, backgroundColor: Colors.white }}
          >
            {portfolio?.map((product, index) => (
              <PortfolioList
                key={index}
                product={product}
              />
            ))}
          </ContentBox>
        </View>
      )}
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Portfolio;
