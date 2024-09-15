import { Image, View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

import AppHeader from "@/components/AppHeader";
import Screen from "@/components/Screen";
import StyledText from "@/components/StyledText";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import AppTextField from "@/components/AppTextField";
import AppDivider from "@/components/AppDivider";
import AppPicker from "@/components/AppPicker";
import AppButton from "@/components/AppButton";

import { retrieveUserData } from "@/storage/userData";

const PersonalDetails = () => {
  const [storedData, setStoredData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [nexOfKin, setNextOfKin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();
      setStoredData(data);
      axios
        .get("https://utl-proxy.vercel.app/api/v1/getclientaccountinfo", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        .then((res) => {
          const { firstname, surname, mobileNumber } = res.data;
          setUserData({
            firstname: firstname,
            surname: surname,
            mobileNumber: mobileNumber,
          });
        })
        .catch((err) => console.error(err));

      axios
        .get("https://utl-proxy.vercel.app/api/v1/getnextofkins", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchData();
  }, []);

  return (
    <Screen>
      <AppHeader />

      <View
        style={{
          marginVertical: 25,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <StyledText
            type="heading"
            variant="semibold"
          >
            Personal Details
          </StyledText>
          <StyledText color={Colors.light}>Evelyn Makinwa</StyledText>
        </View>

        <Image
          source={require("../../assets/images/layer.png")}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
      </View>
      {!userData ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            size={"large"}
            color={Colors.primary}
          />
        </View>
      ) : (
        <View>
          <Formik
            initialValues={{
              firstname: userData.firstname,
              surname: userData.surname,
              phoneNumber: userData.mobileNumber,
              kinFirstname: "",
              kinLastname: "",
              kinEmail: "",
            }}
            onSubmit={(values) => {
              axios
                .post(
                  "https://utl-proxy.vercel.app/api/v1/updateindividualclientinfo",
                  userData,
                  {
                    headers: {
                      Authorization: `Bearer ${storedData && storedData.token}`,
                    },
                  }
                )
                .then((res) => {
                  console.log(res.data);
                })
                .catch((err) => console.error(err));
            }}
          >
            {({ handleChange, handleSubmit }) => (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppTextField
                    name={"firstname"}
                    label={"Full name"}
                    onChangeText={handleChange("firstname")}
                    width={"48%"}
                    value={userData && userData.firstname}
                  />
                  <AppTextField
                    name={"surname"}
                    onChangeText={handleChange("surname")}
                    width={"48%"}
                    rightLabel={"-Update your full name"}
                    rightLabelColor={Colors.light}
                  />
                </View>
                <AppTextField
                  name={"phoneNumber"}
                  onChangeText={handleChange("phoneNumber")}
                  label={"Phone Number"}
                  rightLabel={"-Update your phone number"}
                  rightLabelColor={Colors.light}
                />

                <StyledText
                  type="subheading"
                  variant="medium"
                  style={{ marginTop: 20 }}
                >
                  Next Of Kin
                </StyledText>
                <AppDivider style={{ marginBottom: 20 }} />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppTextField
                    name={"kinFirstname"}
                    label={"Full name"}
                    onChangeText={handleChange("kinFirstname")}
                    width={"48%"}
                  />
                  <AppTextField
                    name={"kinLastname"}
                    onChangeText={handleChange("kinLastname")}
                    width={"48%"}
                    rightLabel={"-Update next of kin's full name"}
                    rightLabelColor={Colors.light}
                  />
                </View>

                <AppTextField
                  name={"kinEmail"}
                  onChangeText={handleChange("kinEmail")}
                  label={"Email Address"}
                  rightLabel={"-Update next of kin's email address"}
                  rightLabelColor={Colors.light}
                />
                <AppTextField
                  name={"kinPhoneNumber"}
                  onChangeText={handleChange("kinPhoneNumber")}
                  label={"Phone Number"}
                  rightLabel={"-Update next of kin's full name"}
                  rightLabelColor={Colors.light}
                />

                <AppPicker
                  label={"Relationship"}
                  placeholder={"Select Relationship with next of kin"}
                  rightLabel={"-How are you related?"}
                  rightLabelColor={Colors.light}
                />
                <AppPicker
                  label={"Gender"}
                  placeholder={"Select Gender"}
                  rightLabel={"-How do they identify?"}
                  rightLabelColor={Colors.light}
                />

                <AppButton
                  customStyles={{ marginVertical: 40 }}
                  onPress={handleSubmit}
                >
                  Save
                </AppButton>
              </>
            )}
          </Formik>
        </View>
      )}
    </Screen>
  );
};

export default PersonalDetails;
