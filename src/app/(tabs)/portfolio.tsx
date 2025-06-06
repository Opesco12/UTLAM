import { StyleSheet, View } from "react-native";
import { Money4 } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

import LayeredScreen from "@/src/components/LayeredScreen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import ContentBox from "@/src/components/ContentBox";
import Loader from "@/src/components/Loader";
import PortfolioListItem from "@/src/components/PortfolioListItem";

import { amountFormatter } from "../../helperFunctions/amountFormatter";
import {
  getFixedIcomeOnlineBalances,
  getMutualFundOnlineBalances,
  getProducts,
  getWalletBalance,
} from "../../api/index";

const Portfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    amount: 0,
  });
  const [mutualFundBalances, setMutualFundBalances] = useState([]);
  const [fixedIncomePortfolio, setFixedIncomePortfolio] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [walletBalance, mutualFundData, investibleProducts] =
        await Promise.all([
          getWalletBalance(),
          getMutualFundOnlineBalances(),
          getProducts(),
        ]);

      setUserBalance({
        currencyCode: walletBalance[0]?.currencyCode || "",
        amount: walletBalance[0]?.amount || 0,
      });

      setMutualFundBalances(mutualFundData || []);

      if (investibleProducts) {
        const updatedPortfolio = await Promise.all(
          investibleProducts.map(async (product) => {
            if (product.portfolioType === 9) {
              const fixedIncomeBalances = await getFixedIcomeOnlineBalances(
                product.portfolioId
              );
              if (fixedIncomeBalances?.length > 0) {
                return {
                  portfolio: product.portfolioName,
                  investments: fixedIncomeBalances,
                  portfolioType: product.portfolioType,
                  portfolioId: product.portfolioId,
                };
              }
            }
            return null;
          })
        );

        setFixedIncomePortfolio(
          updatedPortfolio.filter((item) => item !== null)
        );
      }
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const total = [
      userBalance.amount,
      ...fixedIncomePortfolio.map(
        (portfolio) =>
          portfolio.investments?.reduce(
            (sum, inv) => sum + (inv.currentValue || 0),
            0
          ) || 0
      ),
      ...mutualFundBalances.map(
        (investment) =>
          (investment.balance || 0) + (investment?.pendingDividendAmount || 0)
      ),
    ].reduce((sum, val) => sum + val, 0);

    setTotalBalance(total);
  }, [fixedIncomePortfolio, mutualFundBalances, userBalance]);

  if (error) {
    return (
      <LayeredScreen headerText="My Portfolio">
        <StyledText
          type="title"
          variant="regular"
          color={Colors.error}
        >
          {error}
        </StyledText>
      </LayeredScreen>
    );
  }

  return (
    <LayeredScreen headerText="My Portfolio">
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <ContentBox
            customStyles={{
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0,
              marginVertical: 20,
              backgroundColor: Colors.white,
            }}
          >
            <View style={[styles.flex, { gap: 10 }]}>
              <Money4
                color={Colors.primary}
                size={25}
                variant="Bold"
              />
              <StyledText
                type="title"
                variant="regular"
                color={Colors.primary}
              >
                Total Portfolio Balance
              </StyledText>
            </View>
            <StyledText
              type="heading"
              variant="semibold"
              color={Colors.primary}
              style={{ textAlign: "center" }}
            >
              {amountFormatter.format(totalBalance)}
            </StyledText>
          </ContentBox>

          <ContentBox
            customStyles={{ borderWidth: 0, backgroundColor: Colors.white }}
          >
            <PortfolioListItem
              product={{ portfolio: "Wallet", balance: userBalance.amount }}
            />
            {mutualFundBalances.map((product, index) => (
              <PortfolioListItem
                key={`mutual-${index}`}
                product={product}
              />
            ))}
            {fixedIncomePortfolio.map((product, index) => (
              <PortfolioListItem
                key={`fixed-${index}`}
                product={product}
              />
            ))}
          </ContentBox>
        </View>
      )}
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Portfolio;
