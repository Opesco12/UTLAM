import { Image, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import {
  Book,
  ClipboardTick,
  Headphone,
  LogoutCurve,
  Profile as ProfileIcon,
} from "iconsax-react-native";

import Screen from "@/components/Screen";
import AppHeader from "@/components/AppHeader";
import { Colors } from "@/constants/Colors";
import AppLargeText from "@/components/AppLargeText";
import StyledText from "@/components/StyledText";
import AppListItem from "@/components/AppListItem";
import AppModal from "@/components/AppModal";
import AppModalDialog from "@/components/AppModalDialog";

const Profile = () => {
  return (
    <Screen>
      <AppHeader />
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginVertical: 25 }}>
          <StyledText
            type="heading"
            variant="semibold"
          >
            Profile
          </StyledText>
          <StyledText
            color={Colors.light}
            type="body"
            variant="medium"
          >
            Evelyn Makinwa
          </StyledText>
        </View>
        <Image
          source={require("../../assets/images/layer.png")}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
      </View>

      <View>
        <StyledText
          type="subheading"
          variant="medium"
          style={{ marginVertical: 10 }}
        >
          Account Settings
        </StyledText>
        <View>
          <Link
            href={"/personal-details"}
            asChild
          >
            <AppListItem
              leftIcon={
                <ProfileIcon
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Personal Details
            </AppListItem>
          </Link>
          <Link
            href={"/bank-details"}
            asChild
          >
            <AppListItem
              leftIcon={
                <Book
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Bank Details
            </AppListItem>
          </Link>
          <Link
            href={"/kyc-1"}
            asChild
          >
            <AppListItem
              leftIcon={
                <ClipboardTick
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              KYC
            </AppListItem>
          </Link>
          <AppListItem
            leftIcon={
              <Headphone
                size={20}
                color={Colors.primary}
              />
            }
          >
            Help & Support
          </AppListItem>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <View style={styles.signout}>
          <LogoutCurve
            size={20}
            color={Colors.error}
          />
          <StyledText
            color={Colors.error}
            type="title"
            variant="medium"
          >
            Signout
          </StyledText>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  signout: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.border,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
});

export default Profile;
