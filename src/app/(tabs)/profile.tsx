import { Image, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import {
  Book,
  ClipboardTick,
  Headphone,
  Lock1,
  LogoutCurve,
  Profile as ProfileIcon,
  UserOctagon,
  UserCirlceAdd,
  Profile2User,
  Key,
} from "iconsax-react-native";
import { Pressable } from "react-native";
import { toast } from "sonner-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import AppListItem from "@/src/components/AppListItem";
import ProfileImageUploadModal from "@/src/components/ImageUploadModal";

import { retrieveUserData } from "@/src/storage/userData";
import { logout, fetchClientPhoto, uploadImage } from "@/src/api";

const Profile = () => {
  const [fullname, setFullname] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const logoutUser = async () => {
    const data = await logout(authToken);
    console.log(data);
    router.replace("/(auth)/login");
  };

  const handleUpload = async () => {
    try {
      if (!selectedImage) {
        toast.info("Please select an image");
      } else {
        const response = await uploadImage(selectedImage);
        if (response?.message === "Success") {
          toast.success("Upload Succesful");
          const profileImage = await fetchClientPhoto();
          setProfileImage(profileImage?.photo);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    const userData = await retrieveUserData();
    setFullname(userData?.fullName);
    setAuthToken(userData?.token);

    const profileImage = await fetchClientPhoto();
    setProfileImage(profileImage?.photo);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <Screen
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
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
            {fullname}
          </StyledText>
        </View>
        {profileImage?.length > 0 ? (
          <Image
            src={`data:image/jpeg;base64,${profileImage}`}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          />
        ) : (
          <UserCirlceAdd
            size={50}
            color={Colors.light}
            variant="Bold"
            onPress={() => setIsModalVisible(true)}
          />
        )}
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

          <Link
            href={"/(app)/Referral"}
            asChild
          >
            <AppListItem
              leftIcon={
                <Profile2User
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Referral
            </AppListItem>
          </Link>

          <Link
            href={"/(app)/contact-manager"}
            asChild
          >
            <AppListItem
              leftIcon={
                <UserOctagon
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Contact Account Manager
            </AppListItem>
          </Link>
          <Link
            href={"/(app)/pin-management"}
            asChild
          >
            <AppListItem
              leftIcon={
                <Key
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              PIN Management
            </AppListItem>
          </Link>
          <Link
            href={"/change-password"}
            asChild
          >
            <AppListItem
              leftIcon={
                <Lock1
                  size={20}
                  color={Colors.primary}
                />
              }
            >
              Change Password
            </AppListItem>
          </Link>
          <Link
            asChild
            href={"/(app)/support"}
          >
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
          </Link>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <Pressable onPress={logoutUser}>
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
        </Pressable>
      </View>
      <ProfileImageUploadModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onUpload={handleUpload}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
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
