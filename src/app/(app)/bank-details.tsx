import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { AddCircle, Bank } from "iconsax-react-native";
import { Formik } from "formik";

import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import ContentBox from "@/src/components/ContentBox";
import AppModal from "@/src/components/AppModal";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppPicker from "@/src/components/AppPicker";

const BankDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginVertical: 25 }}
      >
        Bank Details
      </StyledText>

      <ContentBox
        customStyles={{
          backgroundColor: Colors.primary,
          borderWidth: 0,
          borderRadius: 6,
          height: 150,
          marginVertical: 10,
          justifyContent: "center",
          gap: 5,
        }}
      >
        <StyledText
          color={Colors.white}
          variant="medium"
        >
          UNITED BANK FOR AFRICA
        </StyledText>
        <StyledText color={Colors.white}>2055664478</StyledText>
        <StyledText color={Colors.white}>Evelyn Makinwa</StyledText>
        <Bank
          color={Colors.white}
          size={25}
          style={{ position: "absolute", right: 20 }}
        />
      </ContentBox>

      <ContentBox
        customStyles={{
          borderColor: Colors.lightBg,
          borderRadius: 6,
          height: 150,
          justifyContent: "center",
          marginVertical: 10,
          alignItems: "center",
        }}
        onPress={() => setIsModalVisible(true)}
      >
        <AddCircle
          color={Colors.light}
          size={20}
        />
        <StyledText
          color={Colors.light}
          type="body"
          variant="regular"
        >
          Add Bank Details
        </StyledText>
      </ContentBox>

      <AppModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      >
        <StyledText
          type="heading"
          variant="medium"
          style={{ marginVertical: 15 }}
        >
          Bank Details
        </StyledText>
        <Formik
          initialValues={{
            accountName: "",
            accountNumber: "",
          }}
        >
          {({ handleChange, handleSubmit }) => (
            <>
              <AppPicker
                label={"Bank"}
                placeholder={"Select Bank"}
              />
              <View style={{ marginTop: 20, marginBottom: 40, gap: 10 }}>
                <AppTextField
                  name={"accountName"}
                  label={"Account Name"}
                  onChangeText={handleChange("accountName")}
                />
                <AppTextField
                  name={"accountNumber"}
                  label={"Account Number"}
                  onChangeText={handleChange("accountNumber")}
                />
                <AppButton customStyles={{ marginVertical: 20 }}>
                  Submit
                </AppButton>
              </View>
            </>
          )}
        </Formik>
      </AppModal>
    </Screen>
  );
};

export default BankDetails;
