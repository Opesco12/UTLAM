import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import StyledText from "@/src/components/StyledText";
import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";

import {
  getClientInfo,
  updateClientInfo,
  getPendingDocuments,
  uploadClientDocument,
} from "@/src/api";

const initialLayout = { width: Dimensions.get("window").width };

const KYC_1 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    nin: null,
    bvn: null,
  });
  const [clientInfo, setClientInfo] = useState(null);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [isUploading, setIsUploading] = useState({});

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "numbers", title: "Verification Numbers" },
    { key: "documents", title: "Documents Upload" },
  ]);

  const kycValidationSchema = Yup.object().shape({
    nin: Yup.string()
      .matches(/^\d{11}$/, "NIN must be exactly 11 digits")
      .required("NIN is required"),
    bvn: Yup.string()
      .matches(/^\d{11}$/, "BVN must be exactly 11 digits")
      .required("BVN is required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getClientInfo();
      if (response) {
        setData({
          nin: response?.nin,
          bvn: response?.bvn,
        });

        setClientInfo({
          clientType: response?.clientType,
          clientGroupId: response?.clientGroupId,
          surname: response?.surname,
          firstname: response?.firstname,
          dateOfBirth: response?.dateOfBirth,
          emailAddress: response?.emailAddress,
          address1: response?.address1,
          mobileNumber: response?.mobileNumber,
          gender: response?.gender,
          titleCode: response?.titleCode,
        });

        const pendingDocs = await getPendingDocuments();
        const requiredDocs = pendingDocs.filter(
          (doc) =>
            (doc.document === "MEANS OF IDENTIFICATION" && doc?.uploaded < 1) ||
            (doc.document === "PASSPORTS" && doc?.uploaded < 1) ||
            (doc.document === "UTILITY BILL" && doc?.uploaded < 1)
        );
        setPendingDocuments(requiredDocs);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleUpdateInfo = async (values) => {
    try {
      const data = await updateClientInfo({
        ...(clientInfo || {}),
        // nin: values?.nin,
        bvn: values?.bvn,
      });
      if (data) {
        toast.success("Data updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update data");
    }
  };

  const showDocumentPicker = (documentType) => {
    Alert.alert(
      "Select Document",
      "Choose how you want to select your document",
      [
        {
          text: "Camera",
          onPress: () => pickFromCamera(documentType),
        },
        {
          text: "Gallery",
          onPress: () => pickFromGallery(documentType),
        },
        {
          text: "Files",
          onPress: () => pickFromFiles(documentType),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const pickFromCamera = async (documentType) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        toast.error("Camera permission is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedDocuments((prev) => ({
          ...prev,
          [documentType]: result.assets[0],
        }));
      }
    } catch (error) {
      toast.error("Error accessing camera");
      console.error(error);
    }
  };

  const pickFromGallery = async (documentType) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        toast.error("Gallery permission is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedDocuments((prev) => ({
          ...prev,
          [documentType]: result.assets[0],
        }));
      }
    } catch (error) {
      toast.error("Error accessing gallery");
      console.error(error);
    }
  };

  const pickFromFiles = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedDocuments((prev) => ({
          ...prev,
          [documentType]: result.assets[0],
        }));
      }
    } catch (error) {
      toast.error("Error selecting document");
      console.error(error);
    }
  };

  const uploadDocument = async (documentId, documentType) => {
    const document = selectedDocuments[documentType];
    if (!document) {
      toast.error("Please select a document first");
      return;
    }

    setIsUploading((prev) => ({ ...prev, [documentType]: true }));

    try {
      const response = await uploadClientDocument(
        document,
        documentId,
        documentType
      );
      console.log(response);
      console.log("Document: ", document);
      console.log("document type: ", documentType);
      toast.success(`${documentType} uploaded successfully`);

      setSelectedDocuments((prev) => {
        const updated = { ...prev };
        delete updated[documentType];
        return updated;
      });

      const pendingDocs = await getPendingDocuments();
      const requiredDocs = pendingDocs.filter(
        (doc) =>
          (doc.document === "MEANS OF IDENTIFICATION" && doc?.uploaded < 1) ||
          (doc.document === "PASSPORTS" && doc?.uploaded < 1) ||
          (doc.document === "UTILITY BILL" && doc?.uploaded < 1)
      );
      setPendingDocuments(requiredDocs);
    } catch (error) {
      toast.error(`Failed to upload ${documentType}`);
      console.error(error);
    } finally {
      setIsUploading((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const getDocumentDisplayName = (docType) => {
    switch (docType) {
      case "MEANS OF IDENTIFICATION":
        return "ID Document";
      case "PASSPORTS":
        return "Passport Photo";
      case "UTILITY BILL":
        return "Utility Bill";
      default:
        return docType;
    }
  };

  const VerificationNumbers = () => (
    <Formik
      enableReinitialize={true}
      validationSchema={kycValidationSchema}
      initialValues={{
        nin: data?.nin || "",
        bvn: data?.bvn || "",
      }}
      onSubmit={async (values) => {
        await handleUpdateInfo(values);
      }}
    >
      {({ handleChange, handleSubmit }) => (
        <View style={{ marginTop: 20 }}>
          <AppTextField
            label={"National Identification Number"}
            name="nin"
            onChangeText={handleChange("nin")}
            secureTextEntry
            disabled={true}
          />
          <AppTextField
            label={"Biometric Verification Number"}
            name="bvn"
            onChangeText={handleChange("bvn")}
            secureTextEntry
            disabled={data?.bvn ? true : false}
          />
          <AppButton
            customStyles={{ marginTop: 30, marginBottom: 20 }}
            disabled={data?.bvn === null ? false : true}
            onPress={handleSubmit}
          >
            Save
          </AppButton>
        </View>
      )}
    </Formik>
  );

  const DocumentUpload = () => (
    <View style={styles.documentContainer}>
      {pendingDocuments.length === 0 ? (
        <View style={styles.noDocumentsContainer}>
          <StyledText
            type="title"
            variant="medium"
            style={styles.noDocumentsText}
          >
            All required documents have been uploaded
          </StyledText>
        </View>
      ) : (
        <>
          <StyledText
            type="title"
            variant="medium"
            style={styles.documentTitle}
          >
            Upload Required Documents
          </StyledText>
          <StyledText style={{ textAlign: "center" }}>
            Supported formats: JPG, PNG, PDF
          </StyledText>

          {pendingDocuments.map((doc, index) => {
            const docType = doc.document;
            const isSelected = selectedDocuments[docType];
            const isUploadingDoc = isUploading[docType];
            const isImage =
              isSelected &&
              (isSelected.mimeType || isSelected.type)?.startsWith("image/");

            return (
              <View
                key={docType}
                style={styles.documentItem}
              >
                <View style={styles.documentHeader}>
                  <StyledText
                    type="title"
                    variant="medium"
                  >
                    {getDocumentDisplayName(docType)}
                  </StyledText>
                  {isSelected && (
                    <View style={styles.previewContainer}>
                      {isImage ? (
                        <Image
                          source={{ uri: isSelected.uri }}
                          style={styles.previewImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <StyledText
                          variant="semibold"
                          style={styles.selectedText}
                        >
                          Selected: {isSelected.name || "Document"}
                        </StyledText>
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      isSelected && styles.buttonConfirm,
                    ]}
                    onPress={() => showDocumentPicker(docType)}
                    disabled={isUploadingDoc}
                  >
                    <StyledText
                      variant="semibold"
                      type="label"
                      color={isSelected ? Colors.white : Colors.black}
                    >
                      {isSelected ? "Change Document" : "Select Document"}
                    </StyledText>
                  </TouchableOpacity>

                  {isSelected && (
                    <TouchableOpacity
                      style={[
                        styles.buttonConfirm,
                        isUploadingDoc && styles.buttonDisabled,
                      ]}
                      onPress={() => uploadDocument(doc?.documentId, docType)}
                      disabled={isUploadingDoc}
                    >
                      {isUploadingDoc ? (
                        <ActivityIndicator
                          size="small"
                          color={Colors.white}
                        />
                      ) : (
                        <StyledText
                          variant="semibold"
                          type="label"
                          color={Colors.white}
                        >
                          Upload
                        </StyledText>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </>
      )}
    </View>
  );

  const renderScene = SceneMap({
    numbers: VerificationNumbers,
    documents: DocumentUpload,
  });

  if (isLoading) {
    return (
      <Screen>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader />
      <View style={styles.headerContainer}>
        <StyledText
          type="heading"
          variant="semibold"
        >
          KYC Details
        </StyledText>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: Colors.primary }}
            activeColor={Colors.primary}
            inactiveColor={Colors.light}
            style={{ backgroundColor: Colors.white }}
          />
        )}
        style={{ flex: 1, marginTop: 24 }}
      />
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
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  documentContainer: {
    flex: 1,
    marginTop: 20,
  },
  noDocumentsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noDocumentsText: {
    textAlign: "center",
    color: Colors.primary,
  },
  documentTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  documentSubtitle: {
    color: Colors.light,
    marginBottom: 24,
    fontSize: 14,
    textAlign: "center",
  },
  documentItem: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  documentHeader: {
    marginBottom: 12,
  },
  previewContainer: {
    marginTop: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  selectButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonConfirm: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonConfirmText: {
    color: Colors.white,
  },
  buttonDisabled: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default KYC_1;
