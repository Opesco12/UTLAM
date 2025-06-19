import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import TransactionItem from "@/src/components/TransactionItem";
import Loader from "@/src/components/Loader";
import AppMonthPicker from "@/src/components/AppMonthPicker";

import { getPendingWithdrawals, getTransactions } from "@/src/api";

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "transactions", title: "Transaction History" },
    { key: "pending", title: "Pending Withdrawals" },
  ]);

  const initialLayout = { width: Dimensions.get("window").width };

  const fetchData = async () => {
    setLoading(true);
    const date = new Date().toISOString();
    const enddate = date.split("T")[0];
    var newdate = enddate.split("-", 2);
    const startdate = newdate.join("-") + "-01";

    setStartdate(startdate);
    setEnddate(enddate);

    const transactions = await fetchTransactions(startdate, enddate);
    setTransactions(transactions);

    const pendingWithdrawals = await getPendingWithdrawals();
    setPendingWithdrawals(pendingWithdrawals);

    setLoading(false);
  };

  const fetchTransactions = async (startdate, enddate) => {
    const transactions = await getTransactions(startdate, enddate);

    return transactions;
  };

  function formatDateToMonthYear(dateString) {
    const monthAbbreviations = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (dateString !== null) {
      const parts = dateString.split("-");
      if (parts.length !== 3) {
        throw new Error(
          'Invalid date format. Please use "YYYY-MM-DD" format, e.g., "2024-12-31"'
        );
      }

      const [year, month, day] = parts.map(Number);

      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        month < 1 ||
        month > 12
      ) {
        throw new Error(
          'Invalid date components. Please use "YYYY-MM-DD" format with valid date values'
        );
      }

      const monthAbbr = monthAbbreviations[month - 1];

      return `${monthAbbr} - ${year}`;
    }
  }
  function monthToDateRange(monthYearStr) {
    const [month, year] = monthYearStr.split(" ");

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === month.toLowerCase()
    );

    if (monthIndex === -1 || isNaN(parseInt(year))) {
      throw new Error(
        'Invalid date format. Please use "Month YYYY" format, e.g., "December 2024"'
      );
    }

    const yearNum = parseInt(year);

    const startDate = new Date(yearNum, monthIndex, 1);

    const endDate = new Date(yearNum, monthIndex + 1, 0);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
    };
  }

  const TransactionHistory = () => {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <View
              style={{
                marginBottom: 15,
                flexDirection: "row",
                gap: 10,
                alignItems: "baseline",
              }}
            >
              <StyledText variant="medium">
                {formatDateToMonthYear(startdate)}
              </StyledText>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                onPress={() => setIsModalVisible(true)}
              />
            </View>

            {transactions?.length > 0 ? (
              <>
                {transactions.map((transaction, index) => (
                  <TransactionItem
                    key={index}
                    transaction={transaction}
                  />
                ))}
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledText color={Colors.light}>
                  Your transactions will appear here
                </StyledText>
              </View>
            )}
            <AppMonthPicker
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              onSelectMonthYear={async (month, year) => {
                setLoading(true);
                const { start, end } = monthToDateRange(`${month} ${year}`);
                setStartdate(start);
                setEnddate(end);
                try {
                  const transactions = await fetchTransactions(start, end);
                  setTransactions(transactions);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </>
        )}
      </View>
    );
  };

  const PendingTransactions = () => {
    return (
      <View style={{ marginTop: 20 }}>
        {pendingWithdrawals?.length > 0 ? (
          pendingWithdrawals.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
            />
          ))
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StyledText color={Colors.light}>
              Your transactions will appear here
            </StyledText>
          </View>
        )}
      </View>
    );
  };

  const renderScene = SceneMap({
    transactions: TransactionHistory,
    pending: PendingTransactions,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  return (
    <>
      <Screen
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        <AppHeader />
        <StyledText
          type="heading"
          variant="semibold"
          style={{ marginTop: 25 }}
        >
          Transactions
        </StyledText>

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
          style={{ flex: 1, marginTop: 15 }}
        />
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({});

export default Transactions;
