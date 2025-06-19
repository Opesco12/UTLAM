import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import { router, useLocalSearchParams } from "expo-router";

import LayeredScreen from "@/src/components/LayeredScreen";
import AppTextField from "@/src/components/AppTextField";
import AppPicker from "@/src/components/AppPicker";
import AppButton from "@/src/components/AppButton";
import ContentBox from "@/src/components/ContentBox";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";

import { amountFormatter } from "@/src/helperFunctions/amountFormatter";

import { getProducts, getLiabilityProducts, getTenor } from "@/src/api";

const Simulator = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedTenor, setSelectedTenor] = useState(null);
  const [liabilityProducts, setLiabilityProducts] = useState(null);
  const [productTenors, setProductTenors] = useState([]);

  const params = useLocalSearchParams();

  function convertToKebabCase(inputString) {
    inputString = inputString.trim();

    inputString = inputString.toLowerCase();

    inputString = inputString.replace(/\s+/g, "-");

    return inputString;
  }
  const productsList = [
    "UTLAM MONEY MARKET PLAN",
    "UTLAM LIFESTYLE ACCOUNT",
    "UTLAM LIQUIDITY MANAGER",
    "UTLAM TARGET SAVINGS",
    "UTLAM FIXED INCOME STRATEGY",
    "UTLAM BALANCED STRATEGY",
    "UTLAM GROWTH STRATEGY",
    "UTLAM FIXED INCOME PLAN",
    "UTLAM BALANCE PLAN",
    "UTLAM GROWTH PLAN",
  ];
  var imageUrl = productsList.includes(selectedProduct?.label)
    ? `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/${convertToKebabCase(
        selectedProduct?.label
      )}.webp?alt=media&token=9fbb64ae-96b9-49e1-`
    : `https://firebasestorage.googleapis.com/v0/b/utlam-a1951.appspot.com/o/utlam-default.webp?alt=media&token=9fbb64ae-96b9-49e1-`;

  useEffect(() => {
    const fetchData = async () => {
      if (selectedProductId !== null) {
        const liabilityProducts = await getLiabilityProducts(selectedProductId);
        if (liabilityProducts) {
          setLiabilityProducts(liabilityProducts);
          const tenors = await getTenor(liabilityProducts[0].productId);
          setProductTenors(
            tenors?.map((tenor) => {
              return {
                label: `${tenor?.tenor} Days`,
                value: tenor?.tenor,
                interestRate: tenor?.interestRate,
              };
            })
          );
        }
      }
    };
    fetchData();
  }, [selectedProductId]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts();
      const filtered = products
        .filter((product) => product.portfolioType === 9)
        .map((product) => ({
          label: product.portfolioName,
          value: product.portfolioId,
          portfolioTypeName: product.portfolioTypeName,
        }));
      setProducts(filtered);
    };

    fetchData();
  }, []);

  const getInterestRate = () => {
    const foundTenor = productTenors?.find(
      (tenor) => tenor?.value === Number(selectedTenor)
    );
    return foundTenor?.interestRate;
  };

  const addDaysToDate = (days, startDate = new Date()) => {
    const result = new Date(startDate);
    result.setDate(startDate.getDate() + Number(days));
    return result.toDateString();
  };

  const getSelectedProduct = () => {
    const foundProduct = products.find(
      (product) => product?.value === Number(selectedProductId)
    );
    return foundProduct;
  };

  useEffect(() => {
    if (selectedProductId) {
      const product = getSelectedProduct();
      setSelectedProduct(product);
    }

    if (selectedProductId && selectedTenor) {
      const foundTenor = productTenors.find(
        (tenor) => tenor?.value === Number(selectedTenor)
      );
      if (foundTenor) {
        setSelectedTenor(foundTenor.value);
      }
    }
  }, [selectedProductId, selectedTenor]);

  useEffect(() => {
    if (params) {
      setSelectedProductId(params?.portfolioId || "");
      setSelectedTenor(params?.tenor || "");
      const product = getSelectedProduct();
      setSelectedProduct(product);
    }
  }, [params]);

  const processInvestment = async (values) => {
    const { principal, product, tenor } = values;
    setTimeout(() => {
      router.push({
        pathname: "/confirm-investment",
        params: {
          header: selectedProduct?.label,
          headerImageUrl: imageUrl && imageUrl,
          amount: Number(principal),
          portfolioId: product,
          portfolioTypeName: selectedProduct?.portfolioTypeName,
          isLiabilityProduct: true,
          securityId: liabilityProducts[0]?.securityProductId,
          tenor: tenor,
        },
      });
    }, 2000);
  };

  return (
    <LayeredScreen
      headerText={"Investment Simulator"}
      overlay={true}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            principal: params?.amount || "",
            product: Number(params?.portfolioId) || "",
            tenor: Number(params?.tenor) || "",
          }}
          enableReinitialize={true}
          onSubmit={processInvestment}
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
                  setSelectedProductId(value);
                }}
              />
              <AppPicker
                label={"Desired Tenor"}
                options={productTenors}
                placeholder={"Select Tenor"}
                value={values?.tenor}
                onValueChange={(value) => {
                  setFieldValue("tenor", value);
                  setSelectedTenor(value);
                }}
              />

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
                      {values?.tenor === ""
                        ? amountFormatter.format(0)
                        : amountFormatter.format(
                            Number(values.principal) * (getInterestRate() / 100)
                          )}
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
                      {values?.tenor === ""
                        ? amountFormatter.format(0)
                        : amountFormatter.format(
                            Number(values.principal) +
                              Number(values.principal) *
                                (getInterestRate() / 100)
                          )}
                    </StyledText>
                  </View>

                  <View style={styles.lastRow}>
                    <StyledText
                      type="title"
                      color={Colors.primary}
                    >
                      Maturity Date
                    </StyledText>
                    <StyledText variant="semibold">
                      {values?.tenor === ""
                        ? "nil"
                        : addDaysToDate(Number(values?.tenor))}
                    </StyledText>
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
