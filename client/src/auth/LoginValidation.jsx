function LoginValidation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // the number 8 means minimum 8 characters below, must include uppercase, numbers and unconventional characters
  const password_pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;

  if (values.email === "") {
    error.email = "Please enter an email address.";
  } else if (!email_pattern.test(values.email)) {
    error.email = "This email does not exist.";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Please enter your password.";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Incorrect password.";
  } else {
    error.password = "";
  }

  return error;
}

export default LoginValidation;
