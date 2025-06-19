import { StyleSheet, View, ActivityIndicator, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Copy, Notification } from "iconsax-react-native";
import { toast } from "sonner-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik, Field } from "formik";
import * as Yup from "yup";

import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import LayeredScreen from "@/src/components/LayeredScreen";
import AppModal from "@/src/components/AppModal";
import QuickAccess from "@/src/components/QuickAccess";
import Banner from "@/assets/images/svg_images/Banner";
import Otp_Input from "@/src/components/Otp_Input";
import SwipeableBalanceCard from "@/src/components/SwipeableBalanceCard";

import { retrieveUserData } from "@/src/storage/userData";
import {
  getVirtualAccounts,
  getWalletBalance,
  getProducts,
  getMutualFundOnlineBalances,
  getFixedIcomeOnlineBalances,
  getClientBankAccounts,
  debitWallet,
} from "@/src/api";

import { copyToClipboard } from "../../helperFunctions/copyToClipboard";
import AppButton from "@/src/components/AppButton";
import AppTextField from "@/src/components/AppTextField";

const Index = () => {
  const [loading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    amount: 0,
  });
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [pin, setPin] = useState(Array(4).fill(""));
  const [isPinSubmitting, setIsPinSubmitting] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState([]);
  const [clientBanks, setClientBanks] = useState([]);
  const [mutualFundBalances, setMutualFundBalances] = useState([]);
  const [fixedIncomePortfolio, setFixedIncomePortfolio] = useState([]);
  const [totalPortfolioBalance, setTotalPortfolioBalance] = useState(0);

  const handleCopy = async (text) => {
    try {
      await copyToClipboard(text);
      toast.success("Copied");
      setIsDepositModalOpen(false);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy text");
    }
  };

  const validateWithdrawal = async (values, { setSubmitting }) => {
    try {
      if (!clientBanks?.length) {
        toast.error("Please add a bank account in the profile page.");
        setSubmitting(false);
        return;
      }

      if (values.amount <= 0) {
        toast.error("Amount must be greater than zero");
        setSubmitting(false);
        return;
      }

      if (values.amount > userBalance.amount) {
        toast.error("Insufficient Balance");
        setSubmitting(false);
        return;
      }

      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWithdrawalAmount(values.amount);
      setIsWithdrawalModalOpen(false);
      setIsPinModalOpen(true);
    } catch (error) {
      console.error("Withdrawal validation failed:", error);
      toast.error("Validation failed. Please try again later.");
      setSubmitting(false);
    }
  };

  const handleWithdrawal = async (pinString) => {
    try {
      if (!clientBanks?.length) {
        toast.error("Please add a bank account in the profile page.");
        setIsPinSubmitting(false);
        return;
      }

      if (withdrawalAmount > userBalance.amount) {
        toast.error("Insufficient Balance");
        setIsPinSubmitting(false);
        return;
      }

      const requestData = {
        currencyCode: "NGN",
        amount: withdrawalAmount,
        beneficiaryBankAccountNo: clientBanks[0]?.beneficiaryAccountNo,
        transactionPin: Number(pinString),
      };

      const response = await debitWallet(requestData);

      if (response) {
        toast.success(
          "Wallet withdrawal is being processed. Kindly note that withdrawals are processed within 24 hours."
        );
        setIsPinModalOpen(false);
        setPin(Array(4).fill(""));
        setWithdrawalAmount(0);
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again later.");
    } finally {
      setIsPinSubmitting(false);
    }
  };

  const handlePinSubmit = () => {
    setIsPinSubmitting(true);
    const pinString = pin.join("");

    if (pinString.length !== 4) {
      toast.error("Please enter all 4 digits");
      setIsPinSubmitting(false);
      return;
    }

    handleWithdrawal(pinString);
  };

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than zero")
      .required("Amount is required")
      .test(
        "maxBalance",
        "Insufficient Balance",
        (value) => value <= (userBalance.amount || 0)
      ),
  });

  useEffect(() => {
    const loadHideBalance = async () => {
      try {
        const value = await AsyncStorage.getItem("hideBalance");
        if (value !== null) {
          setHideBalance(value === "true");
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadHideBalance();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("hideBalance", hideBalance.toString());
  }, [hideBalance]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [
        userData,
        walletBalance,
        virtualAccounts,
        mutualFundData,
        investibleProducts,
        clientBankData,
      ] = await Promise.all([
        retrieveUserData(),
        getWalletBalance(),
        getVirtualAccounts(),
        getMutualFundOnlineBalances(),
        getProducts(),
        getClientBankAccounts(),
      ]);

      setUserData(userData);
      setFirstname(userData?.fullName?.split(" ")[0] || "");
      setUserBalance({
        currencyCode: walletBalance[0]?.currencyCode || "",
        amount: walletBalance[0]?.amount || 0,
      });
      setVirtualAccount(virtualAccounts || []);
      setClientBanks(clientBankData || []);
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
    } finally {
      setIsLoading(false);
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
          (investment.balance || 0) + (investment.pendingDividendAmount || 0)
      ),
    ].reduce((sum, val) => sum + val, 0);

    setTotalPortfolioBalance(total);
  }, [fixedIncomePortfolio, mutualFundBalances, userBalance]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <LayeredScreen
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <View style={{ paddingHorizontal: 20, flex: 1, flexGrow: 1 }}>
        <View
          style={{
            backgroundColor: Colors.white,
            height: 30,
            width: 30,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 15,
            top: -155,
          }}
        >
          <Notification
            size={25}
            color={Colors.primary}
            variant="Bold"
          />
        </View>

        <View style={{ zIndex: 5, position: "absolute", top: -100, left: 15 }}>
          <StyledText
            color={Colors.white}
            variant="bold"
            type="heading"
          >
            Hello, {firstname}
          </StyledText>
        </View>

        <SwipeableBalanceCard
          userBalance={userBalance.amount}
          totalPortfolioBalance={totalPortfolioBalance}
          hideBalance={hideBalance}
          setHideBalance={setHideBalance}
          loading={loading}
          onRefresh={fetchData}
          onDeposit={() => setIsDepositModalOpen(true)}
          onWithdraw={() => setIsWithdrawalModalOpen(true)}
          onViewPortfolio={() => router.push("/(tabs)/portfolio")}
        />

        <View style={{ flex: 1, zIndex: -1, justifyContent: "space-evenly" }}>
          <QuickAccess />
          <View>
            <Banner width={"100%"} />
          </View>
        </View>
      </View>

      <AppModal
        isModalVisible={isDepositModalOpen}
        setIsModalVisible={setIsDepositModalOpen}
      >
        <StyledText
          type="subheading"
          variant="semibold"
          style={{ marginVertical: 15 }}
        >
          Virtual Accounts
        </StyledText>

        {virtualAccount.map((account, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 0.5,
              borderColor: Colors.border,
              padding: 10,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <View>
              <StyledText variant="medium">
                {account.virtualAccountNo}
              </StyledText>
              <StyledText color={Colors.light}>
                {account.virtualAccountName}
              </StyledText>
              <StyledText variant="medium">
                {account.virtualAccountBankName
                  ? account.virtualAccountBankName
                  : "UTLAM Bank"}
              </StyledText>
            </View>

            <Copy
              size={25}
              color={Colors.primary}
              onPress={() => handleCopy(account?.virtualAccountNo)}
            />
          </View>
        ))}
      </AppModal>

      <AppModal
        isModalVisible={isWithdrawalModalOpen}
        setIsModalVisible={setIsWithdrawalModalOpen}
      >
        <StyledText
          type="subheading"
          variant="semibold"
          style={{ marginVertical: 15 }}
        >
          Withdraw Funds
        </StyledText>

        <Formik
          enableReinitialize={true}
          initialValues={{
            amount: 0,
            bankName: clientBanks[0]?.bankName || "",
            accountNo: clientBanks[0]?.beneficiaryAccountNo || "",
          }}
          validationSchema={amountValidationSchema}
          onSubmit={validateWithdrawal}
        >
          {({ handleSubmit, handleChange, isSubmitting, errors, touched }) => (
            <View>
              <View style={styles.formField}>
                <StyledText
                  type="label"
                  variant="medium"
                  color={Colors.primary}
                >
                  Amount
                </StyledText>
                <Field
                  name="amount"
                  render={({ field }) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors.amount && touched.amount
                          ? styles.inputError
                          : null,
                      ]}
                      inputMode="numeric"
                      placeholder="Enter amount"
                      onChangeText={field.onChange("amount")}
                      value={field.value}
                    />
                  )}
                />
                {errors.amount && touched.amount && (
                  <StyledText
                    type="caption"
                    variant="regular"
                    color={Colors.error}
                  >
                    {errors.amount}
                  </StyledText>
                )}
              </View>

              <AppTextField
                name={"bankName"}
                label={"Bank Name"}
                onChangeText={handleChange("bankName")}
                disabled={true}
              />

              <AppTextField
                name={"accountNo"}
                label={"Account Number"}
                onChangeText={handleChange("accountNo")}
                disabled={true}
              />

              <AppButton
                onPress={handleSubmit}
                disabled={isSubmitting}
                customStyles={{ marginVertical: 25 }}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.white}
                  />
                ) : (
                  <StyledText
                    type="body"
                    variant="semibold"
                    color={Colors.white}
                  >
                    Withdraw
                  </StyledText>
                )}
              </AppButton>
            </View>
          )}
        </Formik>
      </AppModal>

      <AppModal
        isModalVisible={isPinModalOpen}
        setIsModalVisible={(value) => {
          setIsPinModalOpen(value);
          if (!value) setPin(Array(4).fill(""));
        }}
      >
        <StyledText
          type="subheading"
          variant="semibold"
          style={{ marginVertical: 15 }}
        >
          Enter Transaction PIN
        </StyledText>

        <Otp_Input
          codeLength={4}
          code={pin}
          setCode={setPin}
          onCodeFilled={handlePinSubmit}
          isIncorrect={false}
        />

        <AppButton
          onPress={handlePinSubmit}
          disabled={isPinSubmitting}
          customStyles={{ marginTop: 25 }}
        >
          {isPinSubmitting ? (
            <ActivityIndicator
              size="small"
              color={Colors.white}
            />
          ) : (
            <StyledText
              type="body"
              variant="semibold"
              color={Colors.white}
            >
              Confirm PIN
            </StyledText>
          )}
        </AppButton>
      </AppModal>
    </LayeredScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBg,
    flex: 1,
    position: "relative",
  },
  layer: {
    backgroundColor: Colors.primary,
    height: 200,
    width: "100%",
  },
  formField: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.error,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: Colors.light,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  pinButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
});

export default Index;
