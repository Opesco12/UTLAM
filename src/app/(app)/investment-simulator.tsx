import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";

import LayeredScreen from "@/src/components/LayeredScreen";
import AppTextField from "@/src/components/AppTextField";
import AppPicker from "@/src/components/AppPicker";
import AppButton from "@/src/components/AppButton";
import ContentBox from "@/src/components/ContentBox";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";

import { getProducts } from "@/src/api";

const Simulator = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts();
      const filtered = products
        .filter((product) => product.portfolioType === 9)
        .map((product) => ({
          label: product.portfolioName,
          value: product.portfolioId,
        }));
      setProducts(filtered);
    };

    fetchData();
  }, []);

  return (
    <LayeredScreen
      headerText={"Investment Simulator"}
      overlay={true}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            principal: "",
            product: "",
            tenor: "",
          }}
          enableReinitialize={true}
          onSubmit={() => {}}
        >
          {({ handleSubmit, handleChange, setFieldValue, values }) => (
            <>
              <AppTextField
                name={"principal"}
                label={"Principal"}
                onChangeText={handleChange("principal")}
              />
              <AppPicker
                label={"Investment Product"}
                placeholder={"Select Product"}
                options={products}
                value={values.product}
                onValueChange={(value) => {
                  setFieldValue("product", value);
                }}
              />
              <AppPicker label={"Desired Tenor"} />

              <View style={styles.simulationDetails}>
                <StyledText color={Colors.primary}>
                  Simulation Details
                </StyledText>
                <ContentBox>
                  <View style={styles.row}>
                    <StyledText
                      type="title"
                      color={Colors.primary}
                    >
                      Principal
                    </StyledText>
                    <StyledText variant="semibold">
                      {values.principal === ""
                        ? amountFormatter.format(0)
                        : amountFormatter.format(values.principal)}
                    </StyledText>
                  </View>

                  <View style={styles.row}>
                    <StyledText
                      type="title"
                      color={Colors.primary}
                    >
                      Estimated Returns
                    </StyledText>
                    <StyledText variant="semibold">
                      {amountFormatter.format(0)}
                    </StyledText>
                  </View>

                  <View style={styles.row}>
                    <StyledText
                      type="title"
                      color={Colors.primary}
                    >
                      Estimated Payout
                    </StyledText>
                    <StyledText variant="semibold">
                      {amountFormatter.format(0)}
                    </StyledText>
                  </View>

                  <View style={styles.lastRow}>
                    <StyledText
                      type="title"
                      color={Colors.primary}
                    >
                      Maturity Date
                    </StyledText>
                    <StyledText variant="semibold">nil</StyledText>
                  </View>
                </ContentBox>
              </View>

              <AppButton
                onPress={handleSubmit}
                customStyles={{ marginTop: 25 }}
              >
                Proceed to Invest
              </AppButton>
            </>
          )}
        </Formik>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
    paddingVertical: 8,
  },
  lastRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  simulationDetails: {
    marginTop: 20,
  },
});

export default Simulator;
