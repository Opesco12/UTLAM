import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import AppDivider from "./AppDivider";

const TransactionItem = ({ transaction }) => {
  const transactionDate = new Date(transaction.valueDate).toDateString();
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/(app)/tranasaction-details",
          params: {
            transaction: JSON.stringify(transaction),
          },
        });
      }}
    >
      <View style={styles.container}>
        <View style={{ width: "65%" }}>
          <StyledText
            variant="medium"
            type="body"
            numberOfLines={1}
          >
            {transaction.description}{" "}
            {transaction?.portfolio && "-" + transaction.portfolio}
          </StyledText>
          <StyledText
            type="label"
            color={Colors.light}
          >
            {transactionDate}
          </StyledText>
        </View>
        <View style={{ width: "35%" }}>
          <StyledText
            variant="medium"
            type="body"
            style={{ textAlign: "right" }}
            numberOfLines={1}
          >
            {transaction?.status
              ? amountFormatter.format(transaction?.netAmount)
              : amountFormatter.format(transaction.amount)}
          </StyledText>
          {transaction?.status && (
            <StyledText
              variant="medium"
              type="label"
              style={{
                textAlign: "right",
                backgroundColor: "#fff9c4",
                paddingVertical: 2,
                paddingHorizontal: 3,
                borderRadius: 8,
                textAlign: "center",
              }}
              color={"#f9a825"}
            >
              {transaction?.status}
            </StyledText>
          )}
        </View>
      </View>
      <AppDivider />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});

export default TransactionItem;
