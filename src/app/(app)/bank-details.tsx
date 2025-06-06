import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { AddCircle, Bank } from "iconsax-react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner-native";

import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import ContentBox from "@/src/components/ContentBox";
import AppModal from "@/src/components/AppModal";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppPicker from "@/src/components/AppPicker";

import { getBanks, getClientBankAccounts, createClientBank } from "@/src/api";

const BankDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState([]);
  const [clientBanks, setClientBanks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clientbanks = await getClientBankAccounts();
      setClientBanks(clientbanks);

      const banklist = await getBanks();
      setBanks(
        banklist.map((item) => ({
          label: item.bankName.split("-")[0],
          value: item.companyId,
        }))
      );

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateBank = async (values, { setSubmitting }) => {
    const { bank, accountName, accountNo } = values;

    const requestData = {
      beneficiaryCompanyId: bank,
      beneficiaryAccountNo: accountNo,
      currencyCode: "NGN",
      beneficiaryName: accountName,
      countryCode: "NGA",
    };
    const response = await createClientBank(requestData);
    if (response) {
      if (response?.message === "success") {
        toast.success("Bank Details have been added successfully");
        setIsModalVisible(false);
        setSubmitting(false);
      }
    }
  };

  const validationSchema = Yup.object().shape({
    bank: Yup.string().required("Bank is required"),
    accountNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Account number must be exactly 10 digits")
      .required("Account number is required"),

    accountName: Yup.string()
      .required("Account name is required")
      .min(3, "Account name must be at least 3 characters")
      .max(100, "Account name can be at most 100 characters"),
  });

  if (isLoading) {
    return (
      <Screen>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={Colors.primary}
          />
        </View>
      </Screen>
    );
  }

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

      {clientBanks?.map((bank, index) => (
        <ContentBox
          key={index}
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
            {bank?.bankName}
          </StyledText>
          <StyledText color={Colors.white}>
            {bank?.beneficiaryAccountNo}
          </StyledText>
          <StyledText color={Colors.white}>{bank?.beneficiaryName}</StyledText>
          <Bank
            color={Colors.white}
            size={25}
            style={{ position: "absolute", right: 20 }}
          />
        </ContentBox>
      ))}
      {clientBanks?.length < 1 && (
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
      )}

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
            accountNo: "",
            bank: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCreateBank}
        >
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            values,
            isSubmitting,
          }) => (
            <>
              <AppPicker
                label={"Bank"}
                placeholder={"Select Bank"}
                options={banks}
                value={values.bank}
                onValueChange={(value) => setFieldValue("bank", value)}
              />
              {errors?.bank && (
                <StyledText type="label">{errors?.bank}</StyledText>
              )}
              <View style={{ marginTop: 20, marginBottom: 40, gap: 10 }}>
                <AppTextField
                  name={"accountNo"}
                  label={"Account Number"}
                  onChangeText={handleChange("accountNo")}
                />
                <AppTextField
                  name={"accountName"}
                  label={"Account Name"}
                  onChangeText={handleChange("accountName")}
                />
                <AppButton
                  customStyles={{ marginVertical: 20 }}
                  onPress={handleSubmit}
                  disabled={isSubmitting === true && true}
                >
                  {isSubmitting ? (
                    <ActivityIndicator
                      size={"small"}
                      color={Colors.white}
                    />
                  ) : (
                    "Submit"
                  )}
                </AppButton>
              </View>
            </>
          )}
        </Formik>
      </AppModal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BankDetails;
