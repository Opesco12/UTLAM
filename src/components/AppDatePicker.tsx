// import { useState } from "react";
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// const AppDatePicker = ({
//   isDatePickerVisible,
//   setDatePickerVisibility,
//   setDate,
// }) => {
//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     setDate(date);
//     hideDatePicker();
//   };

//   return (
//     <DateTimePickerModal
//       isVisible={isDatePickerVisible}
//       mode="date"
//       onConfirm={handleConfirm}
//       onCancel={hideDatePicker}
//       maximumDate={new Date()}
//     />
//   );
// };

// export default AppDatePicker;

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/src/constants/Colors";
import StyledText from "@/src/components/StyledText";
import { format } from "date-fns";

const DatePicker = ({
  field,
  form,
  label,
  dateFormat = "MM/dd/yyyy",
  minimumDate,
  maximumDate,
  placeholder = "Select date",
  disabled = false,
}) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [date, setDate] = useState(
    field?.value ? new Date(field.value) : new Date()
  );

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setIsPickerVisible(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      form.setFieldValue(field.name, selectedDate);
      form.setFieldTouched(field.name, true);
    }
  };

  const handleConfirm = () => {
    setIsPickerVisible(false);
    form?.setFieldValue(field.name, date);
    form?.setFieldTouched(field.name, true);
  };

  const handleCancel = () => {
    setIsPickerVisible(false);
  };

  const formattedDate = field?.value
    ? format(new Date(field?.value), dateFormat)
    : "";

  return (
    <View style={styles.container}>
      {label && (
        <StyledText
          type="label"
          variant="medium"
          color={Colors.primary}
          style={styles.label}
        >
          {label}
        </StyledText>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setIsPickerVisible(true)}
        disabled={disabled}
        style={[
          form?.touched[field?.name] && form?.errors[field.name]
            ? styles.inputError
            : null,
          disabled && styles.disabled,
        ]}
        accessibilityLabel={label || placeholder}
        accessibilityHint="Tap to select a date"
      >
        <TextInput
          style={styles.input}
          value={formattedDate}
          placeholder={placeholder}
          placeholderTextColor={Colors.light}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {form?.touched[field?.name] && form?.errors[field?.name] && (
        <StyledText
          type="label"
          variant="semibold"
          color={Colors.error}
          style={styles.errorText}
        >
          {form?.errors[field?.name]}
        </StyledText>
      )}

      {isPickerVisible &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent
            animationType="slide"
            visible={isPickerVisible}
            onRequestClose={handleCancel}
          >
            <View style={styles.modalContainer}>
              <View style={styles.pickerContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCancel}>
                    <StyledText
                      type="body"
                      variant="medium"
                      color={Colors.primary}
                    >
                      Cancel
                    </StyledText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirm}>
                    <StyledText
                      type="body"
                      variant="medium"
                      color={Colors.primary}
                    >
                      Done
                    </StyledText>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  textColor={Colors.text}
                  accentColor={Colors.primary}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    height: 49,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default DatePicker;
