import { View } from "react-native";
import { Link } from "expo-router";
import {
  Flash,
  ReceiptText,
  Reserve,
  Calculator,
  StatusUp,
  FavoriteChart,
} from "iconsax-react-native";

import StyledText from "./StyledText";
import MediumBox from "./MediumBox";

import { Colors } from "../constants/Colors";

const QuickAccess = () => {
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.lightPrimary,
        marginTop: 140,
        marginVertical: 15,
        padding: 15,
      }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Flash
          size={25}
          color={Colors.lightPrimary}
          variant="Bold"
        />

        <StyledText
          type="title"
          variant="medium"
          color={Colors.lightPrimary}
        >
          Quick Access
        </StyledText>
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <Link
          href={"/products"}
          asChild
        >
          <MediumBox
            icon={
              <StatusUp
                size={27}
                color={Colors.secondary}
                variant="Bold"
              />
            }
            title={"Invest Money"}
            subtitle={"Grow your wealth securely"}
          />
        </Link>
        <Link
          href={"/portfolio"}
          asChild
        >
          <MediumBox
            icon={
              <FavoriteChart
                size={27}
                color={Colors.secondary}
                variant="Bold"
              />
            }
            title={"My Portfolio"}
            subtitle={"Track your investments at a glance"}
          />
        </Link>
        <Link
          href={"/transactions"}
          asChild
        >
          <MediumBox
            icon={
              <ReceiptText
                size={27}
                color={Colors.secondary}
                variant="Bold"
              />
            }
            title={"My Transactions"}
            subtitle={"Monitor your financial activity"}
          />
        </Link>
        <Link
          href={"/(app)/support"}
          asChild
        >
          <MediumBox
            icon={
              <Reserve
                size={27}
                color={Colors.secondary}
                variant="Bold"
              />
            }
            title={"Help Desk"}
            subtitle={"Get support when you need it"}
          />
        </Link>
      </View>
      <Link
        href={"/(app)/investment-simulator"}
        asChild
      >
        <MediumBox
          style={{ marginTop: 10, width: "100%", flexDirection: "row" }}
          icon={
            <Calculator
              size={27}
              color={Colors.secondary}
              variant="Bold"
            />
          }
          title={"Investment Simulator"}
          subtitle={"Simulate your investment strategies and outcomes"}
        />
      </Link>
    </View>
  );
};

export default QuickAccess;
