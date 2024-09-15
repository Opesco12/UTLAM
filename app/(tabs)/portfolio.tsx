import { StyleSheet, Image, Text, View } from "react-native";
import {
  ArrowCircleRight2,
  Money4,
  Moneys,
  TrendUp,
} from "iconsax-react-native";
import { useEffect, useState } from "react";
import axios from "axios";

import Screen from "@/components/Screen";
import LayeredScreen from "@/components/LayeredScreen";
import StyledText from "@/components/StyledText";
import { Colors } from "@/constants/Colors";
import ContentBox from "@/components/ContentBox";
import { retrieveUserData } from "@/storage/userData";

const PortfolioList = () => {
  return (
    <ContentBox
      customStyles={{
        alignItems: "center",
        backgroundColor: Colors.white,
        borderWidth: 0,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={[styles.flex, { gap: 20 }]}>
        <TrendUp
          color={Colors.secondary}
          size={35}
          variant="Bold"
        />
        <View>
          <StyledText
            type="subheading"
            variant="medium"
            color={Colors.primary}
          >
            Product Name
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
              {" "}
              ₦5, 593,403.00
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
  const [userBalance, setUserBalance] = useState(null);

  const amountFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();

      axios
        .get("https://utl-proxy.vercel.app/api/v1/getclientwalletbalances", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        .then((res) => {
          console.log(res.data);
          setUserBalance({
            currencyCode: res.data[0].currencyCode,
            amount: res.data[0].amount,
          });
        })
        .catch((err) => {
          console.log("Cannot fetch balance");
          console.error(err);
        });
    };
    fetchData();
  }, []);
  return (
    <LayeredScreen headerText={"My Portfolio"}>
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
          <PortfolioList />
          <PortfolioList />
          <PortfolioList />
          <PortfolioList />
          <PortfolioList />
        </ContentBox>
      </View>
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
