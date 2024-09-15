import React, { useState, useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Image,
} from "react-native";

import AppHeader from "@/components/AppHeader";
import Screen from "@/components/Screen";
import StyledText from "@/components/StyledText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

export default function KYCDocumentCapture({
  capturedImage,
  setCapturedImage,
  setIsCameraModalVisible,
}) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  // const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <AppHeader />
        <View style={styles.container}>
          <StyledText
            variant="medium"
            style={{ textAlign: "center" }}
          >
            We need your permission to use the camera
          </StyledText>
          <Button
            onPress={requestPermission}
            title="Grant permission"
          />
        </View>
      </Screen>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        setCapturedImage(photo.uri);
        setIsModalVisible(true);
      } catch (error) {
        Alert.alert("Error", "Failed to capture document");
        console.error(error);
      }
    }
  }

  function acceptImage() {
    if (capturedImage) {
      // Log the URI of the accepted image
      console.log("Accepted image URI:", capturedImage);

      // Here you would typically save or upload the photo
      // Alert.alert("Success", "Document accepted successfully!");

      setIsModalVisible(false);
      setIsCameraModalVisible(false);
      // Reset capturedImage if you want to allow taking another photo
      // setCapturedImage(null);
    } else {
      console.error("No image captured");
      Alert.alert("Error", "No image to accept");
    }
  }

  function retakeImage() {
    setIsModalVisible(false);
    setCapturedImage(null);
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.documentFrame} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={styles.previewImage}
            />
          )}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={retakeImage}
            >
              <Text style={styles.modalButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={acceptImage}
            >
              <Text style={styles.modalButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    borderRadius: 15,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  captureButton: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 15,
    borderRadius: 50,
  },
  captureText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  documentFrame: {
    position: "absolute",
    top: "15%",
    left: 15,
    right: 15,
    bottom: "35%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});
