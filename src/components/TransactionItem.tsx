import { StyleSheet, View } from "react-native";
import { Receive } from "iconsax-react-native";

import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import AppDivider from "./AppDivider";

const TransactionItem = ({ transaction }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={{ width: "70%" }}>
          <StyledText
            variant="medium"
            type="body"
            numberOfLines={1}
          >
            {transaction.description} - {transaction.portfolio}
          </StyledText>
          <StyledText
            type="label"
            color={Colors.light}
          >
            Sep 12th, 10:36:46
          </StyledText>
        </View>

        <StyledText
          variant="medium"
          type="body"
          style={{ width: "30%", textAlign: "right" }}
          numberOfLines={1}
        >
          {amountFormatter.format(transaction.amount)}
        </StyledText>
      </View>
      <AppDivider />
    </>
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
