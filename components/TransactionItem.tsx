import { StyleSheet, View } from "react-native";
import { Receive } from "iconsax-react-native";

import { Colors } from "@/constants/Colors";
import StyledText from "./StyledText";

const TransactionItem = ({ type }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <View
          style={{
            backgroundColor: Colors.lightPrimary,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
          }}
        >
          <Receive
            color={Colors.white}
            size={25}
            variant="Bold"
          />
        </View>

        <View>
          <StyledText
            variant="medium"
            type="body"
          >
            Credit - Wallet(NGN)
          </StyledText>
          <StyledText
            type="label"
            color={Colors.light}
          >
            Sep 12th, 10:36:46
          </StyledText>
        </View>
      </View>
      <StyledText variant="medium">₦5000</StyledText>
    </View>
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
