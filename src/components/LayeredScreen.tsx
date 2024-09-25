import {
  Image,
  StatusBar,
  View,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import Screen from "./Screen";
import { Colors } from "@/src/constants/Colors";
import { Children } from "react";
import StyledText from "./StyledText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Layer from "../../assets/images/svg_images/Layer.js";

const LayeredScreen = ({
  children,
  backgroundColor,
  headerImageUrl,
  opacity,
  overlay = false,
  headerText,
  refreshing,
  onRefresh,
  ...props
}) => {
  const navigation = useNavigation();
  const statusBarHeight = StatusBar.currentHeight;
  return (
    <>
      {Platform.OS === "android" ? (
        <>
          <Screen
            customStyles={[
              {
                paddingTop: 0,
                paddingHorizontal: 0,
                backgroundColor: Colors.lightBg,
              },
            ]}
            {...props}
          >
            <ImageBackground
              source={
                headerImageUrl && headerImageUrl !== null
                  ? { uri: headerImageUrl }
                  : require("../../assets/images/layer.png")
              }
              style={styles.imageBg}
            >
              {overlay ? (
                <View
                  style={[
                    styles.overlay,
                    { paddingTop: statusBarHeight, paddingBottom: 10 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    color={Colors.white}
                    size={35}
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                  />
                  <StyledText
                    color={Colors.white}
                    type="heading"
                    variant="semibold"
                    style={{ textAlign: "center" }}
                  >
                    {headerText}
                  </StyledText>
                </View>
              ) : (
                <View>
                  {headerText && (
                    <Image
                      source={require("../../assets/images/logo_white.png")}
                      style={{ alignSelf: "center" }}
                    />
                  )}
                  <StyledText
                    color={Colors.white}
                    type="heading"
                    variant="semibold"
                    style={{ textAlign: "center" }}
                  >
                    {headerText}
                  </StyledText>
                </View>
              )}
            </ImageBackground>

            {children}
          </Screen>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <ImageBackground
              source={
                headerImageUrl && headerImageUrl !== null
                  ? { uri: headerImageUrl }
                  : require("../../assets/images/layer.png")
              }
              style={styles.imageBg}
            >
              {overlay ? (
                <SafeAreaView style={styles.overlay}>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    color={Colors.white}
                    size={35}
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                  />
                  <StyledText
                    color={Colors.white}
                    type="heading"
                    variant="semibold"
                    style={{ textAlign: "center", marginBottom: 10 }}
                  >
                    {headerText}
                  </StyledText>
                </SafeAreaView>
              ) : (
                <SafeAreaView>
                  {headerText && (
                    <Image
                      source={require("../../assets/images/logo_white.png")}
                      style={{ alignSelf: "center" }}
                    />
                  )}
                  <StyledText
                    color={Colors.white}
                    type="heading"
                    variant="semibold"
                    style={{ textAlign: "center" }}
                  >
                    {headerText}
                  </StyledText>
                </SafeAreaView>
              )}
            </ImageBackground>
            {children}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    left: 20,
    // top: 0,
    // position: 'absolute'
  },
  imageBg: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
    paddingBottom: 10,
    // marginBottom: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "space-between",
  },
});

export default LayeredScreen;
