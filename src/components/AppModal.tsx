import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useRef } from "react";
import { Colors } from "@/src/constants/Colors";

const AppModal = ({
  children,
  isModalVisible,
  setIsModalVisible,
  modalHeight,
  style,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === 5) {
      // State.END
      if (nativeEvent.translationY > 60) {
        // Swipe threshold
        Animated.timing(translateY, {
          toValue: modalHeight || 300,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setIsModalVisible(false));
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="none" // Animation handled by PanGestureHandler
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  minHeight: modalHeight ? modalHeight : 300,
                  transform: [{ translateY }],
                },
                style,
              ]}
            >
              <View style={styles.line}></View>
              {children}
            </Animated.View>
          </PanGestureHandler>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    overflow: "hidden",
  },
  line: {
    alignSelf: "center",
    backgroundColor: Colors.black,
    borderRadius: 3,
    opacity: 0.4,
    height: 5,
    width: 50,
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
});

export default AppModal;
