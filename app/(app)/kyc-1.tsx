import {
  StyleSheet,
  Text,
  Image,
  View,
  StatusBar,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, router } from "expo-router";
import { Camera, CloseCircle, Gallery } from "iconsax-react-native";
import * as ImagePicker from "expo-image-picker";
import ImageView from "react-native-image-viewing";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";

import { Colors } from "@/constants/Colors";
import AppTextField from "@/components/AppTextField";
import AppButton from "@/components/AppButton";
import AppPicker from "@/components/AppPicker";
import StyledText from "@/components/StyledText";
import AppHeader from "@/components/AppHeader";
import Screen from "@/components/Screen";
import AppModal from "@/components/AppModal";
import KYCDocumentCapture from "./camera-screen";
import AppDatePicker from "@/components/AppDatePicker";
// import LottieView from "@/components/native/LottieView.native";

import { verifyDocuments } from "../../api/verification/index";
import { handleVerificationResponses } from "../../helperFunctions/verification";

const KYC_1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState(null);
  const [documentImage, setDocumentImage] = useState({ uri: "" });
  const [visible, setIsVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [voterDOB, setVoterDOB] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const documentTypes = {
    PASSPORT: "International Passport",
    LICENSE: "Driver's License",
    CARD: "Voter's Card",
  };

  const validationSchema = Yup.object().shape({
    nin: Yup.string()
      .matches(/^\d{11}$/, "NIN must be exactly 11 digits")
      .required("NIN is required"),

    bvn: Yup.string()
      .matches(/^\d{11}$/, "BVN must be exactly 11 digits")
      .required("BVN is required"),

    voterNumber: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("Voter's Card Number is required")
        : // .matches(
          //   /^[0-9]{8}-[0-9]{8}-[0-9]{3}$/,
          //   "Invalid Voter's Card Number format. It should be in the format: 12345678-12345678-123"
          // )
          Yup.string().notRequired();
    }),

    voterFirstname: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("First Name is required")
        : Yup.string().notRequired();
    }),
    voterLastname: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("Last Name is required")
        : Yup.string().notRequired();
    }),
    voterLga: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("Local Goverment Area is required")
        : Yup.string().notRequired();
    }),
    voterState: Yup.string().when(() => {
      return documentType === "Voter's Card"
        ? Yup.string().required("State is required")
        : Yup.string().notRequired();
    }),
  });

  const options = [
    {
      label: "International Passport",
      value: "International Passport",
    },
    { label: "Driver's License", value: "Driver's License" },
    { label: "Voter's Card", value: "Voter's Card" },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setDocumentImage({ uri: result.assets[0].uri });
    }
  };

  const images = [documentImage && documentImage];

  useEffect(() => {
    if (capturedImage !== null) {
      setDocumentImage({ uri: capturedImage });
      // setFieldValue("imageUri", capturedImage);
    }
  }, [capturedImage]);

  function formatDate(isoString) {
    const date = new Date(isoString);
    return [
      date.getUTCDate().toString().padStart(2, "0"),
      (date.getUTCMonth() + 1).toString().padStart(2, "0"),
      date.getUTCFullYear(),
    ].join("/");
  }

  return (
    <Screen>
      <AppHeader />

      <View style={{ marginTop: 20 }}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          KYC Details
        </StyledText>
        <StyledText
          type="body"
          variant="medium"
          color={Colors.light}
        >
          Step 1 of 2
        </StyledText>

        <Formik
          validationSchema={validationSchema}
          initialValues={{
            nin: "",
            bvn: "",
            voterNumber: "",
            voterFirstname: "",
            voterLastname: "",
            voterLga: "",
            voterState: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            setVerifying(true);
            console.log(values);
            const {
              bvn,
              nin,
              voterFirstname,
              voterLastname,
              voterLga,
              voterNumber,
              voterState,
            } = values;
            const responses = await verifyDocuments({
              bvn: bvn,
              DOB: voterDOB,
              documentImage: documentImage,
              documentType: documentType,
              firstname: voterFirstname,
              lastname: voterLastname,
              LGA: voterLga,
              nin: nin,
              state: voterState,
              vin: voterNumber,
            });

            handleVerificationResponses(responses);
            setVerifying(false);
          }}
        >
          {({ handleChange, handleSubmit, errors, touched, setFieldValue }) => (
            <View style={{ marginTop: 20 }}>
              <AppTextField
                label={"National Identification Number"}
                name="nin"
                onChangeText={handleChange("nin")}
              />
              <AppTextField
                label={"Biometric Verification Number"}
                name="bvn"
                onChangeText={handleChange("bvn")}
              />

              <AppPicker
                label={"Government Issued Identification"}
                placeholder={"Select Document Type"}
                options={options}
                onValueChange={(value) => {
                  setDocumentType(value);
                  setFieldValue("selectedDocument", value);
                }}
                value={documentType}
              />

              {documentType && documentType === "Voter's Card" ? (
                <>
                  <AppTextField
                    label={"Voter's Identification Number"}
                    name={"voterNumber"}
                    onChangeText={handleChange("voterNumber")}
                  />
                  <AppTextField
                    label={"First Name"}
                    name={"voterFirstname"}
                    onChangeText={handleChange("voterFirstname")}
                  />
                  <AppTextField
                    label={"Last Name"}
                    name={"voterLastname"}
                    onChangeText={handleChange("voterLastname")}
                  />
                  <StyledText
                    type="label"
                    variant="medium"
                    color={Colors.primary}
                    style={{ marginTop: 10 }}
                  >
                    Date of Birth
                  </StyledText>
                  <AppButton
                    onPress={() => setDatePickerVisibility(true)}
                    customStyles={{
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.light,
                      marginTop: 5,
                      marginBottom: 10,
                    }}
                    textColor={Colors.primary}
                  >
                    {voterDOB !== null
                      ? formatDate(voterDOB)
                      : "Select Date of Birth"}
                  </AppButton>
                  <AppTextField
                    label={"State"}
                    name={"voterState"}
                    onChangeText={handleChange("voterState")}
                  />
                  <AppTextField
                    label={"Local Government Area"}
                    name={"voterLga"}
                    onChangeText={handleChange("voterLga")}
                  />
                </>
              ) : (
                documentType && (
                  <>
                    <StyledText
                      type="label"
                      variant="medium"
                      color={Colors.primary}
                      style={{ marginBottom: 5 }}
                    >
                      Upload ID Document
                    </StyledText>
                    <AppButton
                      customStyles={{
                        backgroundColor: Colors.white,
                        borderWidth: 1,
                        borderColor: Colors.light,
                      }}
                      textColor={Colors.primary}
                      onPress={() => setIsModalOpen(!isModalOpen)}
                    >
                      <AntDesign
                        name="cloudupload"
                        size={20}
                        color={Colors.primary}
                      />
                      Upload File (JPG, PNG, PDF)
                    </AppButton>
                  </>
                )
              )}

              {documentImage && documentImage.uri !== "" && (
                <View style={{ flexDirection: "row" }}>
                  <TouchableWithoutFeedback
                    onPress={() => setIsVisible(true)}
                    style={{ flexDirection: "row", gap: 40 }}
                  >
                    <Image
                      source={{ uri: documentImage && documentImage.uri }}
                      style={{
                        height: 50,
                        width: 50,
                        marginVertical: 10,
                        borderRadius: 10,
                      }}
                    />
                  </TouchableWithoutFeedback>
                </View>
              )}
              <AppButton
                onPress={() => {
                  if (documentType !== null) {
                    if (
                      documentType !== "Voter's Card" &&
                      documentImage.uri !== ""
                    ) {
                      handleSubmit();
                    } else if (documentType === "Voter's Card") {
                      handleSubmit();
                    } else {
                      showMessage({
                        message: `Please upload or take a picture of your ${documentType}`,
                        type: "warning",
                      });
                    }
                  } else {
                    showMessage({
                      message: "Please select a document type",
                      type: "warning",
                    });
                  }
                }}
                customStyles={{ marginTop: 30 }}
              >
                Submit
              </AppButton>
            </View>
          )}
        </Formik>
      </View>
      <AppModal
        isModalVisible={isModalOpen}
        setIsModalVisible={setIsModalOpen}
        modalHeight={200}
      >
        <View style={{ paddingVertical: 20, gap: 15 }}>
          <TouchableOpacity
            style={styles.modalList}
            onPress={() => {
              // router.push("/camera-screen");
              setIsCameraActive(true);
              setIsModalOpen(false);
            }}
          >
            <Camera
              size={25}
              color={Colors.primary}
            />
            <StyledText
              variant="medium"
              type="title"
            >
              Capture Image
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalList}
            onPress={() => {
              setIsModalOpen(false);
              pickImage();
            }}
          >
            <Gallery
              size={25}
              color={Colors.primary}
            />
            <StyledText
              variant="medium"
              type="title"
            >
              Select from Gallery
            </StyledText>
          </TouchableOpacity>
        </View>
      </AppModal>

      <AppModal
        modalHeight={"95%"}
        isModalVisible={isCameraActive}
        setIsModalVisible={setIsCameraActive}
        style={{ paddingHorizontal: 0, paddingVertical: 0 }}
      >
        <KYCDocumentCapture
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
          setIsCameraModalVisible={setIsCameraActive}
        />
      </AppModal>

      <ImageView
        images={images}
        imageIndex={documentImage.uri !== "" && 0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

      <AppDatePicker
        isDatePickerVisible={isDatePickerVisible}
        setDatePickerVisibility={setDatePickerVisibility}
        setDate={setVoterDOB}
      />

      {verifying && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <View
            style={{
              height: 250,
              width: 250,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              zIndex: 5,
            }}
          >
            <LottieView
              loop
              autoPlay
              source={require("../../assets/animations/verifying.json")}
              style={{ height: 200, width: 200 }}
            />
          </View>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  modalList: {
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});

export default KYC_1;
