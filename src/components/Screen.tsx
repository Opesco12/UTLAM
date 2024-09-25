import {
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { Colors } from "@/src/constants/Colors";
import KeyboardAvoidingWrapper from "./KeyboardAvoidingWrapper";

const statusBarHeight = StatusBar.currentHeight;

const Screen = ({
  children,
  customStyles,
  stickyHeaderIndices,
  refreshing,
  onRefresh,
}) => {
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
            {/* <KeyboardAvoidingWrapper> */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <View style={{ flex: 1 }}>{children}</View>
            </ScrollView>
            {/* </KeyboardAvoidingWrapper> */}
          </View>
        </>
      ) : (
        <>
          <View style={[styles.container, customStyles]}>
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardAvoidingWrapper>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={[{ flexGrow: 1 }]}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  // keyboardShouldPersistTaps="handled"
                >
                  {children}
                </ScrollView>
              </KeyboardAvoidingWrapper>
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
