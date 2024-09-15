import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";

const responseMessages = {
  "00": "Successful",
  "01": "Record not found. Please ensure all details are correct and resubmit.",
  "02": "Service is currently unavailable. Please try again later.",
  "07": "This ID has been blocked or watch-listed. Please contact support for assistance.",
};

const documentNames = {
  NIN: "National Identification Number",
  BVN: "Bank Verification Number",
  Passport: "International Passport",
  License: "Driver's License",
  VoterCard: "Voter's Card",
};

export const handleVerificationResponses = (responses, navigateTo) => {
  const allSuccessful = responses.every(
    (response) => response.response_code === "00"
  );
  const allFailed = responses.every(
    (response) => response.response_code !== "00"
  );

  if (allSuccessful) {
    showMessage({
      message: "Verification Successful",
      description: "All your documents have been verified successfully.",
      type: "success",
    });
    setTimeout(() => {
      router.replace("/(tabs)/profile");
    }, 2000);
  } else if (allFailed) {
    showMessage({
      message: "Verification Failed",
      description:
        "None of your documents could be verified. Please check your information and try again.",
      type: "danger",
      duration: 5000,
    });
  } else {
    const failedVerifications = responses.filter(
      (response) => response.response_code !== "00"
    );

    let errorMessages = failedVerifications.map((response) => {
      const documentName = documentNames[response.type] || response.type;
      const message =
        responseMessages[response.response_code] || "An unknown error occurred";
      return `${documentName}: ${message}`;
    });

    showMessage({
      message: "Some Verifications Failed",
      description:
        "The following documents could not be verified:\n\n" +
        errorMessages.join("\n\n"),
      type: "warning",
      duration: 7000,
    });
  }
};
