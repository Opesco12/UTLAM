import {
  Image,
  StatusBar,
  View,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import Screen from "./Screen";
import { Colors } from "@/src/constants/Colors";
import StyledText from "./StyledText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LayeredScreen = ({
  children,
  backgroundColor,
  headerImageUrl,
  opacity,
  overlay = false,
  headerText,
  refreshing = false,
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
                      style={{ alignSelf: "center", height: 35, width: 35 }}
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            style={{ flex: 1 }}
          >
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
                        style={{ alignSelf: "center", height: 35, width: 35 }}
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
          </KeyboardAvoidingView>
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
