function SignupValidation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;

  if (values.name === "") {
    error.name = "Name should not be empty.";
  } else {
    error.name = "";
  }

  if (values.email === "") {
    error.email = "Email should not be empty.";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email didn't match.";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Password should not be empty.";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Password should be at least 6 characters and include unconventional characters.";
  } else {
    error.password = "";
  }

  return error;
}

export default SignupValidation;
