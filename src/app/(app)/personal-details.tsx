import {
  ScrollView,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import { Formik } from "formik";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { toast } from "sonner-native";

import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import AppTextField from "@/src/components/AppTextField";
import AppPicker from "@/src/components/AppPicker";
import AppButton from "@/src/components/AppButton";

import {
  userProfileSchema,
  nextOfKinSchema,
} from "../../validationSchemas/userSchema";
import { retrieveUserData } from "@/src/storage/userData";
import {
  createNextOfKin,
  getClientInfo,
  getNextOfKins,
  updateClientInfo,
} from "@/src/api";

const initialLayout = { width: Dimensions.get("window").width };

const PersonalDetails = () => {
  const [storedData, setStoredData] = useState(null);
  const [userHasNextOfKin, setUserHasNextOfKin] = useState(0);
  const [userData, setUserData] = useState(null);
  const [nexOfKin, setNextOfKin] = useState(null);
  const [kinRelationship, setKinRelationship] = useState(null);
  const [gender, setGender] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "personal", title: "Personal Details" },
    { key: "nextOfKin", title: "Next of Kin" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();
      setStoredData(data);

      const clientInfo = await getClientInfo();
      const {
        firstname,
        surname,
        mobileNumber,
        dateOfBirth,
        emailAddress,
        address1,
        maritalStatus,
        titleCode,
        placeOfBirth,
        occupation,
        religion,
        mothersMaidenName,
        clientType,
        clientGroupId,
        gender,
        nin,
      } = clientInfo;
      setUserData({
        firstname: firstname,
        surname: surname,
        mobileNumber: mobileNumber,
        gender: gender,
        dateOfBirth: dateOfBirth,
        emailAddress: emailAddress,
        address1: address1,
        maritalStatus: maritalStatus,
        titleCode: titleCode,
        placeOfBirth: placeOfBirth,
        occupation: occupation,
        religion: religion,
        mothersMaidenName: mothersMaidenName,
        clientType: clientType,
        clientGroupId: clientGroupId,
        nin: nin,
      });

      const nextOfKins = await getNextOfKins();
      if (nextOfKins.length > 0) {
        setUserHasNextOfKin(1);
        setNextOfKin(nextOfKins[0]);
        setKinRelationship(nextOfKins[0].relationship);
        setGender(nextOfKins[0].gender);
      }
    };

    fetchData();
  }, []);

  const kinRelationships = [
    { label: "Spouse", value: "Spouse" },
    { label: "Parent", value: "Parent" },
    { label: "Sibling", value: "Sibling" },
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
    { label: "Guardian", value: "Guardian" },
    { label: "Aunt", value: "Aunt" },
    { label: "Uncle", value: "Uncle" },
    { label: "Niece", value: "Niece" },
    { label: "Nephew", value: "Nephew" },
    { label: "Cousin", value: "Cousin" },
    { label: "Other", value: "Other" },
  ];

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  const maritalStatusOptions = [
    {
      label: "Single",
      value: "S",
    },
    { label: "Married", value: "M" },
    { label: "Divorced", value: "D" },
    { label: "Other", value: "O" },
  ];

  const titleOptions = [
    {
      transId: 4,
      value: "Chief",
      label: "Chief",
    },
    {
      transId: 1,
      value: "Miss",
      label: "Miss",
    },
    {
      transId: 2,
      value: "Mr",
      label: "Mr",
    },
    {
      transId: 3,
      value: "Mrs",
      label: "Mrs",
    },
  ];

  const PersonalDetailsForm = () => (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      style={{ marginTop: 10 }}
    >
      <Formik
        enableReinitialize={true}
        validationSchema={userProfileSchema}
        initialValues={{
          firstname: userData?.firstname || "",
          surname: userData?.surname || "",
          phoneNumber: userData?.mobileNumber || "",
          placeOfBirth: userData?.placeOfBirth || "",
          occupation: userData?.occupation || "",
          religion: userData?.religion || "",
          mothersMaidenName: userData?.mothersMaidenName || "",
          maritalStatus: userData?.maritalStatus || "",
          titleCode: userData?.titleCode || "",
          nin: userData?.nin || "",
        }}
        onSubmit={async (values) => {
          try {
            const data = await updateClientInfo({
              clientType: userData?.clientType,
              clientGroupId: userData?.clientGroupId,
              surname: values?.surname,
              firstname: values?.firstname,
              dateOfBirth: userData?.dateOfBirth,
              emailAddress: userData?.emailAddress,
              address1: userData?.address1,
              mobileNumber: values?.phoneNumber,
              gender: userData?.gender,
              titleCode: values?.titleCode,
              maritalStatus: values?.maritalStatus,
              occupation: values?.occupation,
              religion: values?.religion,
              mothersMaidenName: values?.mothersMaidenName,
              placeOfBirth: values?.placeOfBirth,
              nin: values?.nin,
            });
            if (data) {
              toast.success("Personal Information Updated Successfully");
            }
          } catch (error) {
            console.error(error.response);
          }
        }}
      >
        {({
          handleChange,
          handleSubmit,
          isSubmitting,
          values,
          setFieldValue,
        }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <AppTextField
                name={"firstname"}
                label={"First Name"}
                onChangeText={handleChange("firstname")}
                width={"48%"}
                value={userData?.firstname}
                readonly
              />
              <AppTextField
                name={"surname"}
                onChangeText={handleChange("surname")}
                width={"48%"}
                readonly
              />
            </View>
            <AppTextField
              name={"phoneNumber"}
              onChangeText={handleChange("phoneNumber")}
              label={"Phone Number"}
              readonly
            />

            <AppTextField
              name={"nin"}
              onChangeText={handleChange("nin")}
              label={"NIN (National Identification Number)"}
              secureTextEntry={true}
              readonly
            />

            <AppPicker
              label={"Marital Status"}
              placeholder={"Select Marital Status"}
              rightLabelColor={Colors.light}
              options={maritalStatusOptions}
              onValueChange={(value) => setFieldValue("maritalStatus", value)}
              value={values.maritalStatus}
              clickable={values.maritalStatus === "" || !values.maritalStatus}
            />

            <AppPicker
              label={"Title"}
              placeholder={"Select Title"}
              rightLabelColor={Colors.light}
              options={titleOptions}
              onValueChange={(value) => setFieldValue("titleCode", value)}
              value={values.titleCode}
              clickable={values.titleCode === "" || !values.titleCode}
            />

            <AppTextField
              name={"placeOfBirth"}
              onChangeText={handleChange("placeOfBirth")}
              label={"Place of Birth"}
              rightLabelColor={Colors.light}
              readonly={values?.placeOfBirth !== "" ? true : false}
            />

            <AppTextField
              name={"occupation"}
              onChangeText={handleChange("occupation")}
              label={"Occupation"}
              rightLabelColor={Colors.light}
              readonly={values?.occupation !== "" ? true : false}
            />
            <AppTextField
              name={"religion"}
              onChangeText={handleChange("religion")}
              label={"Religion"}
              rightLabelColor={Colors.light}
              readonly={values?.religion !== "" ? true : false}
            />

            <AppTextField
              name={"mothersMaidenName"}
              onChangeText={handleChange("mothersMaidenName")}
              label={"Mother's Maiden Name"}
              rightLabelColor={Colors.light}
              readonly={values?.mothersMaidenName !== "" ? true : false}
            />

            <AppButton
              customStyles={{ marginVertical: 20 }}
              onPress={handleSubmit}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size={"small"}
                  color={Colors.white}
                />
              ) : (
                "Save Personal Details"
              )}
            </AppButton>
          </View>
        )}
      </Formik>
    </ScrollView>
  );

  const NextOfKinForm = () => (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      style={{ marginTop: 10 }}
    >
      <Formik
        enableReinitialize={true}
        validationSchema={nextOfKinSchema}
        initialValues={
          userHasNextOfKin > 0
            ? {
                kinFirstname: nexOfKin?.firstname || "",
                kinLastname: nexOfKin?.surname || "",
                kinEmail: nexOfKin?.email || "",
                kinPhoneNumber: nexOfKin?.telephoneNo || "",
              }
            : {
                kinFirstname: "",
                kinLastname: "",
                kinEmail: "",
                kinPhoneNumber: "",
              }
        }
        onSubmit={async (values) => {
          const { kinEmail, kinFirstname, kinLastname, kinPhoneNumber } =
            values;
          const nextOfKinData = {
            email: kinEmail,
            firstname: kinFirstname,
            surname: kinLastname,
            telephoneNo: kinPhoneNumber,
            relationship: kinRelationship,
            gender: gender,
          };
          if (userHasNextOfKin === 0) {
            const data = await createNextOfKin(nextOfKinData);
            if (data) {
              toast.success("Next of Kin added Successfully.");
              router.replace("/(tabs)/profile");
            }
          }
        }}
      >
        {({ handleChange, handleSubmit, isSubmitting }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <AppTextField
                name={"kinFirstname"}
                label={"First Name"}
                onChangeText={handleChange("kinFirstname")}
                width={"48%"}
                readonly={userHasNextOfKin === 1}
              />
              <AppTextField
                name={"kinLastname"}
                onChangeText={handleChange("kinLastname")}
                width={"48%"}
                label={"Last Name"}
                rightLabelColor={Colors.light}
                readonly={userHasNextOfKin === 1}
              />
            </View>
            <AppTextField
              name={"kinEmail"}
              onChangeText={handleChange("kinEmail")}
              label={"Email Address"}
              rightLabel={"-Update next of kin's email"}
              rightLabelColor={Colors.light}
              readonly={userHasNextOfKin === 1}
            />
            <AppTextField
              name={"kinPhoneNumber"}
              onChangeText={handleChange("kinPhoneNumber")}
              label={"Phone Number"}
              rightLabel={"-Update next of kin's phone"}
              rightLabelColor={Colors.light}
              readonly={userHasNextOfKin === 1}
            />
            <AppPicker
              label={"Relationship"}
              placeholder={"Select Relationship with next of kin"}
              rightLabel={"-How are you related?"}
              rightLabelColor={Colors.light}
              options={kinRelationships}
              onValueChange={(value) => setKinRelationship(value)}
              value={kinRelationship}
              clickable={userHasNextOfKin === 1 ? false : true}
            />
            <AppPicker
              label={"Gender"}
              placeholder={"Select Gender"}
              rightLabel={"-How do they identify?"}
              rightLabelColor={Colors.light}
              options={genderOptions}
              onValueChange={(value) => setGender(value)}
              value={gender}
              clickable={userHasNextOfKin === 1 ? false : true}
            />
            <AppButton
              customStyles={{ marginVertical: 20 }}
              onPress={() => {
                if (gender && kinRelationship) {
                  handleSubmit();
                } else {
                  showMessage({
                    message: "Please fill out all fields",
                    type: "warning",
                  });
                }
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size={"small"}
                  color={Colors.white}
                />
              ) : (
                "Save Next of Kin"
              )}
            </AppButton>
          </View>
        )}
      </Formik>
    </ScrollView>
  );

  const renderScene = SceneMap({
    personal: PersonalDetailsForm,
    nextOfKin: NextOfKinForm,
  });
  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }}>
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
              Profile
            </StyledText>
            <StyledText color={Colors.light}>{storedData?.fullName}</StyledText>
          </View>
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
            style={{ flex: 1 }}
          />
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default PersonalDetails;
