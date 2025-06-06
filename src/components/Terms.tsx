import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";
import { Colors } from "@/src/constants/Colors";

const Terms = ({ isModalVisible, setIsModalVisible }) => {
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                UTLAM Mobile Application Terms and Conditions
              </Text>
              <Text style={styles.paragraph}>
                Brought to you by The UTL Asset Management Limited.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>1. Introduction</Text>
              <Text style={styles.paragraph}>
                You will only have access to the App if you have been duly
                authorised to act as a User on behalf of a Customer that has
                signed the Mobile App Terms and Conditions with UTL Asset
                Management Limited relevant jurisdiction, as updated from time
                to time.
              </Text>
              <Text style={styles.paragraph}>
                By using this App, you agree to be bound by these Terms. You
                acknowledge that this agreement is entered into by and between
                you and UTL Asset Management Limited.
              </Text>
              <Text style={styles.paragraph}>
                Use of the App is considered acceptance of these Terms. Do not
                use the App if You do not accept these Terms.
              </Text>
              <Text style={styles.paragraph}>
                You agree that you will only use the App in line with these
                Terms and any additional terms mentioned below that may apply,
                including any terms and conditions incorporated in these Terms
                by reference and applicable laws, rules and regulations in the
                relevant jurisdiction.
              </Text>
              <Text style={[styles.paragraph, styles.important]}>
                Important clauses, which may limit our responsibility or involve
                some risk for you, will be in bold and italics. You must pay
                special attention to these clauses.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>2. Definitions</Text>
              <Text style={styles.paragraph}>
                We have defined some words for consistency. These words will
                begin with a capital letter, where indicated. Singular words
                include the plural and the other way around.
              </Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Word
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Meaning
                  </Text>
                </View>
                {[
                  {
                    word: "Access Codes",
                    meaning:
                      "Any type of unique identifier used to enable a person to identify themselves and gain authorised access to the Services, including any password, operator identification codes, two factor authentication codes and alternative security methods.",
                  },
                  {
                    word: "App",
                    meaning:
                      "UTL Asset Management Limited's mobile application, downloaded onto your Device from your App Store, for which channel you have registered, to access the Mobile App System.",
                  },
                  {
                    word: "App Store",
                    meaning:
                      "Your Device's application store provided by Apple or Android, as is applicable to you, from which you download the App.",
                  },
                  {
                    word: "Asset Management",
                    meaning:
                      "The UTL Asset Management Limited entity with which the Customer has agreed to the Mobile App Terms and Conditions.",
                  },
                  {
                    word: "Customer",
                    meaning: "A customer of the Company.",
                  },
                  {
                    word: "Device",
                    meaning:
                      "The device you use to access the App such as a cell phone, smartphone and / or tablet or any similar technology.",
                  },
                  {
                    word: "ISP",
                    meaning:
                      "An Internet service provider, which is an organisation that provides access to the Internet.",
                  },
                  {
                    word: "Operational Guide",
                    meaning:
                      "The document which sets out the procedures and regulations that apply in respect of the Services, which procedures and regulations are accessible through the Mobile App System, and which document is incorporated herein by reference.",
                  },
                  {
                    word: "Personal Information",
                    meaning:
                      "Personal Information as defined by the applicable data protection laws including the Nigeria Data Protection Act 2023 (NDPA).",
                  },
                  {
                    word: "Transaction",
                    meaning:
                      "Any debit or credit on the UTLAM Account following your instruction and actioned by UTLAM or the use of any UTLAM facilities available on this App. Transact has a similar meaning. Transactions are subject to their respective product terms and condition.",
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    style={styles.tableRow}
                  >
                    <Text style={[styles.tableCell, styles.tableWordCell]}>
                      {item.word}
                    </Text>
                    <Text style={styles.tableCell}>{item.meaning}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>3. Access to the App</Text>
              <Text style={styles.paragraph}>
                You can have only one App on a Device at a time, but you can
                download the App onto as many Devices as you require.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>4. Use of the App</Text>
              <Text style={styles.paragraph}>
                <Text style={styles.subsection}>4.1</Text> You should only use
                the latest version of the App. The App Store will notify you of
                any updates / upgrades that are available to you. If you do not
                install the latest version, the App may not function correctly
                and you may experience security and / or data flaws, for which
                we will not be liable under any circumstances.
              </Text>
              <Text style={styles.paragraph}>
                <Text style={styles.subsection}>4.2</Text> You should only use
                the App on a Device for which it is intended, and as allowed by
                the usage rules set out in your App Store's terms of service.
              </Text>
              <Text style={styles.paragraph}>
                <Text style={styles.subsection}>4.3</Text> You can only Transact
                in line with the company facilities available to you through the
                Customer's Profile. You will not be afforded any additional
                permissions that have not been otherwise granted on the Profile.
              </Text>
              <Text style={styles.paragraph}>
                <Text style={styles.subsection}>4.4</Text> The App allows you to
                open only one Profile at a time; meaning you can only Transact
                with the Profile you have open at any given time.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>5. Fees and costs</Text>
              <Text style={styles.paragraph}>
                <Text style={styles.subsection}>5.1</Text> There is no fee to
                use the App. You will continue to be charged Transaction fees as
                per your existing pricing agreement.
              </Text>
              <Text style={styles.paragraph}>
                <Text style={styles.subsection}>5.2</Text> UTLAM mobile network
                operator data costs will be charged when you download the App,
                use the App, and thereafter receive notifications.
              </Text>
            </View>

            <View style={[styles.section, styles.footer]}>
              <Text style={styles.footerText}>
                For complete terms and conditions, please visit:{" "}
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL("https://utlam.com")}
                >
                  www.utlam.com
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 10,
    lineHeight: 20,
  },
  important: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.light,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.light,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: Colors.light,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: Colors.text,
  },
  tableHeaderCell: {
    fontWeight: "600",
    color: Colors.black,
  },
  tableWordCell: {
    fontWeight: "600",
    color: Colors.black,
  },
  subsection: {
    fontWeight: "600",
    color: Colors.black,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: Colors.light,
    paddingTop: 15,
  },
  footerText: {
    fontSize: 12,
    color: Colors.border,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});

export default Terms;
