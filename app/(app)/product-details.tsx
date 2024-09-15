import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Moneys,
  Calendar2,
  PercentageCircle,
  Judge,
} from "iconsax-react-native";
import axios from "axios";

import Screen from "@/components/Screen";
import ContentBox from "@/components/ContentBox";
import { Colors } from "@/constants/Colors";
import AppTextField from "@/components/AppTextField";
import AppButton from "@/components/AppButton";
import LayeredScreen from "@/components/LayeredScreen";
import StyledText from "@/components/StyledText";
import SavingDetails from "@/components/SavingDetails";

import { retrieveUserData } from "@/storage/userData";
import { router, useLocalSearchParams } from "expo-router";

const ProductDetails = ({ route }) => {
  const [userBalance, setUserBalance] = useState();
  const { header, headerImageUrl } = useLocalSearchParams();
  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .moreThan(4999, "Minimum Investment is ₦5000")
      .required("Amount is required"),
    // .lessThan(
    //   userBalance && userBalance.amount - 1,
    //   "Amount is greater than wallet balance"
    // )
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await retrieveUserData();

      axios
        .get("https://utl-proxy.vercel.app/api/v1/getclientwalletbalances", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        .then((res) => {
          console.log(res.data);
          setUserBalance({
            currencyCode: res.data[0].currencyCode,
            amount: res.data[0].amount,
          });
        })
        .catch((err) => {
          console.log("Cannot fetch balance");
          console.error(err);
        });
    };
    fetchData();
  }, []);

  const amountFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  return (
    <LayeredScreen
      overlay={true}
      headerImageUrl={headerImageUrl && headerImageUrl}
      headerText={header && header}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <ContentBox
            customStyles={{
              backgroundColor: Colors.white,
              borderWidth: 0,
              elevation: 1,
              marginBottom: 20,
              marginVertical: 15,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledText
                color={Colors.lightPrimary}
                type="title"
                variant="semibold"
                style={{ color: Colors.lightPrimary, fontSize: 15 }}
              >
                Current Balance
              </StyledText>
            </View>
            <StyledText
              type="heading"
              variant="semibold"
              color={Colors.primary}
              style={{
                textAlign: "center",
              }}
            >
              {userBalance && amountFormatter.format(userBalance.amount)}
            </StyledText>
          </ContentBox>

          <ContentBox
            customStyles={{
              borderColor: Colors.light,
              marginBottom: 20,
              gap: 15,
            }}
          >
            <ContentBox customStyles={{ padding: 0, borderWidth: 0 }}>
              <ContentBox
                customStyles={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 0,
                  borderWidth: 0,
                }}
              >
                <SavingDetails
                  title={"Annualized Yield"}
                  detail={"8.99%"}
                  icon={
                    <PercentageCircle
                      variant="Bold"
                      size={25}
                      color={Colors.primary}
                    />
                  }
                />
                <SavingDetails
                  title={"Min. Investment"}
                  detail={"₦200,000"}
                  icon={
                    <Moneys
                      variant="Bold"
                      size={25}
                      color={Colors.primary}
                    />
                  }
                />
              </ContentBox>
            </ContentBox>

            <ContentBox customStyles={{ padding: 0, borderWidth: 0 }}>
              <ContentBox
                customStyles={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 0,
                  borderWidth: 0,
                }}
              >
                <SavingDetails
                  title={"Min. Holding Period"}
                  detail={"90 Days"}
                  icon={
                    <Calendar2
                      variant="Bold"
                      size={25}
                      color={Colors.primary}
                    />
                  }
                />
                <SavingDetails
                  title={"Penalty Rate"}
                  detail={"20%"}
                  icon={
                    <Judge
                      variant="Bold"
                      size={25}
                      color={Colors.primary}
                    />
                  }
                />
              </ContentBox>
            </ContentBox>
          </ContentBox>

          <Formik
            validationSchema={validationSchema}
            initialValues={{ amount: 0 }}
            onSubmit={(values, { setSubmitting }) => {
              const { amount } = values;
              //  if ()
              setSubmitting(true);
              setTimeout(() => {
                setSubmitting(false);
                router.push({
                  pathname: "/confirm-investment",
                  params: {
                    header: header,
                    headerImageUrl: headerImageUrl && headerImageUrl,
                    amount: Number(amount),
                  },
                });
              }, 5000);
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting }) => (
              <ContentBox customStyles={{ backgroundColor: Colors.white }}>
                <AppTextField
                  label={"Amount to invest"}
                  name={"amount"}
                  onChangeText={handleChange("amount")}
                  leftIcon={
                    <StyledText
                      type="subheading"
                      variant="semibold"
                      color={Colors.primary}
                    >
                      ₦
                    </StyledText>
                  }
                  leftIconContainerStyle={{ marginLeft: 10 }}
                  keyboardType="numeric"
                />
                <AppButton
                  customStyles={{ marginTop: 20 }}
                  onPress={handleSubmit}
                >
                  {isSubmitting ? (
                    <ActivityIndicator
                      size={"small"}
                      color={Colors.white}
                    />
                  ) : (
                    "Invest Now"
                  )}
                </AppButton>
              </ContentBox>
            )}
          </Formik>
        </View>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ProductDetails;
