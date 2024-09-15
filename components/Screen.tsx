import {
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { Colors } from "@/constants/Colors";

const statusBarHeight = StatusBar.currentHeight;

const Screen = ({ children, customStyles, stickyHeaderIndices }) => {
  return (
    <>
      <ExpoStatusBar style="dark" />
      {Platform.OS === "android" ? (
        <>
          <View
            style={[
              styles.container,
              { paddingTop: statusBarHeight },
              customStyles,
            ]}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1 }}>{children}</View>
            </ScrollView>
          </View>
        </>
      ) : (
        <>
          <View
            style={[
              styles.container,
              {
                // paddingTop: statusBarHeight
              },
              customStyles,
            ]}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </SafeAreaView>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default Screen;
