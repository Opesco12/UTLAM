import {
  Dimensions,
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  EmptyWallet,
  Refresh2,
  Eye,
  EyeSlash,
  ReceiveSquare2,
  TransmitSqaure2,
} from "iconsax-react-native";

import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import AppRipple from "@/src/components/AppRipple";

import { amountFormatter } from "../helperFunctions/amountFormatter";

const SwipeableBalanceCard = ({
  userBalance,
  totalPortfolioBalance,
  hideBalance,
  setHideBalance,
  loading,
  onRefresh,
  onDeposit,
  onWithdraw,
  onViewPortfolio,
}) => {
  const screenWidth = Dimensions.get("screen").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (screenWidth - 30));
    setCurrentIndex(index);
  };

  const renderBalanceCard = () => (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 15,
        elevation: 5,
        height: 160,
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 5,
        width: screenWidth - 30,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <EmptyWallet
          size={25}
          color={Colors.primary}
          variant="Bold"
        />
        <StyledText
          color={Colors.primary}
          type="title"
          variant="medium"
        >
          Wallet Balance
        </StyledText>
        <Pressable onPress={onRefresh}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={Colors.light}
            />
          ) : (
            <Refresh2
              size={15}
              color={Colors.light}
              style={{ marginLeft: 10 }}
            />
          )}
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 12,
        }}
      >
        {hideBalance ? (
          <StyledText
            color={Colors.primary}
            type="heading"
            variant="bold"
          >
            ₦ ******
          </StyledText>
        ) : (
          <StyledText
            color={Colors.primary}
            type="heading"
            variant="bold"
          >
            {amountFormatter.format(userBalance)}
          </StyledText>
        )}

        <Pressable onPress={() => setHideBalance(!hideBalance)}>
          {hideBalance ? (
            <Eye
              size={25}
              color={Colors.light}
            />
          ) : (
            <EyeSlash
              size={25}
              color={Colors.light}
            />
          )}
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-around",
          flex: 1,
        }}
      >
        <AppRipple
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 7,
            flexDirection: "row",
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            overflow: "hidden",
            width: "47%",
          }}
          onPress={onDeposit}
        >
          <ReceiveSquare2
            size={27}
            color={Colors.secondary}
            variant="Bold"
          />
          <StyledText
            color={Colors.text}
            type="body"
            variant="medium"
          >
            Deposit
          </StyledText>
        </AppRipple>

        <AppRipple
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 7,
            flexDirection: "row",
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            overflow: "hidden",
            width: "47%",
          }}
          onPress={onWithdraw}
        >
          <TransmitSqaure2
            size={27}
            color={Colors.primary}
            variant="Bold"
          />
          <StyledText
            color={Colors.text}
            type="body"
            variant="medium"
          >
            Withdraw
          </StyledText>
        </AppRipple>
      </View>
    </View>
  );

  const renderPortfolioBalanceCard = () => (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 15,
        elevation: 5,
        height: 160,
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 5,
        justifyContent: "space-between",
        width: screenWidth - 30,
      }}
    >
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <EmptyWallet
            size={25}
            color={Colors.primary}
            variant="Bold"
          />
          <StyledText
            color={Colors.primary}
            type="title"
            variant="medium"
          >
            Portfolio Balance
          </StyledText>
          <Pressable onPress={onRefresh}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={Colors.light}
              />
            ) : (
              <Refresh2
                size={15}
                color={Colors.light}
                style={{ marginLeft: 10 }}
              />
            )}
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 12,
          }}
        >
          {hideBalance ? (
            <StyledText
              color={Colors.primary}
              type="heading"
              variant="bold"
            >
              ₦ ******
            </StyledText>
          ) : (
            <StyledText
              color={Colors.primary}
              type="heading"
              variant="bold"
            >
              {amountFormatter.format(totalPortfolioBalance)}
            </StyledText>
          )}

          <Pressable onPress={() => setHideBalance(!hideBalance)}>
            {hideBalance ? (
              <Eye
                size={25}
                color={Colors.light}
              />
            ) : (
              <EyeSlash
                size={25}
                color={Colors.light}
              />
            )}
          </Pressable>
        </View>
      </View>
      <TouchableOpacity
        onPress={onViewPortfolio}
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          borderWidth: 1,
          borderColor: Colors.light,
          borderRadius: 8,
        }}
      >
        <StyledText
          type="body"
          variant="semibold"
          color={Colors.primary}
        >
          View Portfolio
        </StyledText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        position: "absolute",
        top: -55,
        left: 0,
        right: 0,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        {renderBalanceCard()}
        {renderPortfolioBalanceCard()}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
          gap: 8,
        }}
      >
        {[0, 1].map((index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                currentIndex === index ? Colors.primary : Colors.light,
              opacity: currentIndex === index ? 1 : 0.5,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default SwipeableBalanceCard;
