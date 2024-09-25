import { StyleSheet, View } from "react-native";
import axios from "axios";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import { useEffect, useState } from "react";
import TransactionItem from "@/src/components/TransactionItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTransactions } from "@/src/api";
import Loader from "@/src/components/Loader";

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const date = new Date().toISOString();
    const enddate = date.split("T")[0];
    var newdate = enddate.split("-", 2);
    const startdate = newdate.join("-") + "-01";

    const transactions = await getTransactions(startdate, enddate);
    console.log(transactions);
    setTransactions(transactions);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginVertical: 25 }}
      >
        Transactions
      </StyledText>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View
            style={{
              marginBottom: 15,
              flexDirection: "row",
              gap: 10,
              alignItems: "baseline",
            }}
          >
            <StyledText>Sep</StyledText>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
            />
          </View>

          {transactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
            />
          ))}

          {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <StyledText color={Colors.light}>
          Your recent transactions will appear here
        </StyledText>
      </View> */}
        </>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default Transactions;
