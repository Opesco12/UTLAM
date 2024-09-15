import axios from "axios";
import { showMessage } from "react-native-flash-message";

export const verifyDocuments = async ({
  nin,
  bvn,
  documentType,
  documentImage,
  firstname,
  lastname,
  vin,
  DOB,
  state,
  LGA,
}) => {
  const API_Key = "live_sk_RfxvOPK05yXRXObmXaYuGcs3pOWQJ3FrKL9gMO9";
  const APP_ID = "a3394093-5a56-4381-ad3f-9479bbe7e9fa";
  const ninOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/vnin",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { number_nin: nin },
  };

  const bvnOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/bvn_validation",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { number: bvn },
  };

  const passportOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/national_passport_image",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { image: documentImage },
  };

  const licenseOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/drivers_license/image",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { image: documentImage },
  };

  const cardOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/voters_card",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: {
      number: vin,
      first_name: firstname,
      last_name: lastname,
      dob: DOB,
      lga: LGA,
      state: state,
    },
  };
  const responses = [];

  try {
    const NINVerification = await axios.request(ninOptions);
    console.log("NIN response: ", NINVerification.data.response_code);
    responses.push({
      type: "NIN",
      response_code: NINVerification.data.response_code,
    });

    const BVNVerification = await axios.request(bvnOptions);
    console.log("BVN response: ", BVNVerification.data.response_code);
    responses.push({
      type: "BVN",
      response_code: BVNVerification.data.response_code,
    });

    if (documentType === "International Passport") {
      const PassportVerification = await axios.request(passportOptions);
      console.log(
        "Passport response: ",
        PassportVerification.data.response_code
      );
      responses.push({
        type: "Passport",
        response_code: PassportVerification.data.response_code,
      });
    } else if (documentType === "Driver's License") {
      const LicenseVerification = await axios.request(licenseOptions);
      console.log(
        "License Verification: ",
        LicenseVerification.data.response_code
      );
      responses.push({
        type: "License",
        response_code: LicenseVerification.data.response_code,
      });
    } else if (documentType === "Voter's Card") {
      const CardVerification = await axios.request(cardOptions);
      console.log("Card Verification: ", CardVerification.data.response_code);
      responses.push({
        type: "VoterCard",
        response_code: CardVerification.data.response_code,
      });
    }
  } catch (error) {
    showMessage({ message: "An error occurred", type: "warning" });
    console.log(error);
    responses.push({
      type: "Error",
      error: error.message || "An unknown error occurred",
    });
  }

  return responses;
};
