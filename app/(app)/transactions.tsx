import { StyleSheet, View } from "react-native";
import axios from "axios";

import Screen from "@/components/Screen";
import AppHeader from "@/components/AppHeader";
import StyledText from "@/components/StyledText";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { Receive, ReceiveSquare2 } from "iconsax-react-native";
import TransactionItem from "@/components/TransactionItem";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // axios.get("https://utl-proxy.vercel.app/api/v1/getclientwalletbalances");
  }, []);
  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginVertical: 25 }}
      >
        Recent Transactions
      </StyledText>

      <TransactionItem />
      <TransactionItem />
      <TransactionItem />
      <TransactionItem />

      {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <StyledText color={Colors.light}>
          Your recent transactions will appear here
        </StyledText>
      </View> */}
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default Transactions;
