import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Header } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import axios from "axios";

import Screen from "@/components/Screen";
import { Colors } from "@/constants/Colors";
import FilterBox from "@/components/FilterBox";
import StyledText from "@/components/StyledText";
import Product from "@/components/Product";
import AppDivider from "@/components/AppDivider";
import LayeredScreen from "@/components/LayeredScreen";
import ContentBox from "@/components/ContentBox";
import Toggle from "@/components/Toggle";

import SEC from "../../assets/images/svg_images/SEC";
import { Link } from "expo-router";

const Products = () => {
  const [products, setProducts] = useState([]);
  const statusBarHeight = StatusBar.currentHeight;
  const navigation = useNavigation();

  const toggleOptions = [
    { label: "All", value: "All" },
    { label: "Mutual Funds", value: "Mutual Funds" },
    { label: "Liabilities", value: "Liabilities" },
  ];

  useEffect(() => {
    axios
      .get("https://utl-proxy.vercel.app/api/v1/getclientinvestibleproducts")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        showMessage({ message: "Unable to fetch data", type: "warning" });
      });
  }, []);

  return (
    <LayeredScreen headerText={"Investment Products"}>
      <Toggle
        options={toggleOptions}
        onValueChange={(value) => console.log(value)}
      />

      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 6,
            marginVertical: 10,
          }}
        >
          <StyledText
            type="label"
            variant="medium"
            color={Colors.primary}
            style={{ textAlign: "center", marginVertical: 10 }}
          >
            {products && products.length > 0 ? products.length : 0} investment
            products available
          </StyledText>
        </View>

        <View>
          {products &&
            products.length > 0 &&
            products.map((product, index) => (
              <Link
                href={"/product-details"}
                asChild
              >
                <Product
                  product={product}
                  key={index}
                />
              </Link>
            ))}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
          }}
        >
          <SEC />
        </View>
      </View>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({});

export default Products;
