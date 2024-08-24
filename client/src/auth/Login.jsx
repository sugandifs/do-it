import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginValidation from "./LoginValidation";
import SignupAlert from "./components/SignupAlert";
import LogoutAlert from "./components/LogoutAlert";

function Login() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  const showSignUpAlert = location.state?.showSignUpAlert || false;
  const showLogoutAlert = location.state?.showLogoutAlert || false;

  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = LoginValidation(values);
    setErrors(err);

    if (!err.email && !err.password) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/login`, values)
        .then((res) => {
          if (res.data.Status === "Success") {
            console.log(res);
            navigate("/home");
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <img
              src="/check.svg"
              alt="Do It!"
              className="mx-auto text-center h-12 w-auto"
            />
            <h3 className="text-center text-blue-700 font-bold">Do It!</h3>
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mt-5">
            Please allow up to 50 seconds for the server to wake up after
            pressing the 'Sign in' button.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {showSignUpAlert && <SignupAlert />}
          {showLogoutAlert && <LogoutAlert />}
          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={handleInput}
                  className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                    errors.email ? "border-red-500" : "border-0"
                  }`}
                />
                {errors.email && (
                  <span class="block mt-2 text-sm text-red-500 text-left">
                    Please enter a valid email address
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleInput}
                  required
                  className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                    errors.password ? "border-red-500" : "border-0"
                  }`}
                />
                {errors.password && (
                  <span class="block mt-2 text-sm text-red-500 text-left">
                    Please enter a valid password
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-blue-700 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
