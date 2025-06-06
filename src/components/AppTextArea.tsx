import React, { useState, forwardRef } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

const Textarea = forwardRef(
  (
    {
      value,
      onChangeText,
      placeholder = "Enter text...",
      maxLength,
      rows = 4,
      style,
      containerStyle,
      label,
      error,
      disabled = false,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(value?.length || 0);

    const handleTextChange = (text) => {
      setCharCount(text.length);
      onChangeText?.(text);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const textInputStyle = [
      styles.textInput,
      {
        height: rows * 20 + 20, // Approximate height based on rows
      },
      isFocused && styles.focused,
      error && styles.error,
      disabled && styles.disabled,
      style,
    ];

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={rows}
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          textAlignVertical="top"
          style={textInputStyle}
          {...props}
        />

        <View style={styles.footer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {maxLength && (
            <Text style={styles.charCount}>
              {charCount}/{maxLength}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  focused: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  error: {
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    flex: 1,
  },
  charCount: {
    color: "#666",
    fontSize: 12,
    marginLeft: 8,
  },
});

export default Textarea;

// Usage example:
/*
import Textarea from './Textarea';

function App() {
  const [text, setText] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Textarea
        label="Description"
        value={text}
        onChangeText={setText}
        placeholder="Enter your description here..."
        maxLength={500}
        rows={6}
        error={text.length === 0 ? 'This field is required' : null}
      />
    </View>
  );
}
*/
