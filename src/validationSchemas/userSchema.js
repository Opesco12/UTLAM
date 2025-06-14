import * as Yup from "yup";

export const userLoginSchema = Yup.object().shape({
  email: Yup.string().email("Email is not valid").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const existingUserRegistrationSchema = Yup.object().shape({
  accountNumber: Yup.string()
    .matches(/^\d+$/, "Account number must contain only digits")
    .required("Account number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^[A-Za-z\d@$!%*?#&]+$/,
      "Password can only contain letters, numbers, and @$!%*#?&"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password is required"),
});

export const userRegisterSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  lastname: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Email is not valid").required("Email is required"),

  gender: Yup.string().required("Select a gender"),
  country: Yup.string().required("Select a country"),
  dob: Yup.string().required("Date of birth is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^[A-Za-z\d@$!%*?#&]+$/,
      "Password can only contain letters, numbers, and @$!%*#?&"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),

  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(50, "Address must not exceed 100 characters"),

  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),

  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters"),

  nin: Yup.string()
    .required("NIN is required")
    .matches(/^\d{11}$/, "NIN must be exactly 11 digits"),
  bvn: Yup.string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),
  referredBy: Yup.string(),
  agreedToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

export const RegisterStep1ValidationSchema = Yup.object().shape({
  firstname: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  lastname: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Email is not valid").required("Email is required"),
  dob: Yup.string().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^[A-Za-z\d@$!%*?#&]+$/,
      "Password can only contain letters, numbers, and @$!%*#?&"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const RegisterStep2ValidationSchema = Yup.object().shape({
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address must not exceed 255 characters"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  nin: Yup.string()
    .required("NIN is required")
    .matches(/^\d{11}$/, "NIN must be exactly 11 digits"),
  bvn: Yup.string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),
  referredBy: Yup.string(),
  agreedToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string().email("Email is not valid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^[A-Za-z\d@$!%*?#&]+$/,
      "Password can only contain letters, numbers, and @$!%*#?&"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
  token: Yup.string("Please input the token in your mail").required(),
});

export const userProfileSchema = Yup.object().shape({
  firstname: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  surname: Yup.string()
    .required("Surname is required")
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must not exceed 50 characters"),

  phoneNumber: Yup.string().required("Phone number is required"),
  placeOfBirth: Yup.string()
    .required("Place of birth is required")
    .min(2, "Place of Birth must be at least 2 characters")
    .max(50, "Place of Birth must not exceed 50 characters"),
  occupation: Yup.string()
    .required("Occupation is required")
    .min(2, "Occupation must be at least 2 characters")
    .max(50, "Occupation must not exceed 50 characters"),
  religion: Yup.string()
    .required("Religion is required")
    .min(2, "Religion must be at least 2 characters")
    .max(50, "Religion must not exceed 50 characters"),
  mothersMaidenName: Yup.string()
    .required("Mother's Maiden Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
});

export const nextOfKinSchema = Yup.object().shape({
  kinFirstname: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Kin's First Name is required"),

  kinLastname: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Kin's Last name is required"),

  kinEmail: Yup.string()
    .email("Invalid email address")
    .required("Kin's Email Address is required"),
  kinPhoneNumber: Yup.string().required("Kin's Phone number is required"),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^[A-Za-z\d@$!%*?#&]+$/,
      "Password can only contain letters, numbers, and @$!%*#?&"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
