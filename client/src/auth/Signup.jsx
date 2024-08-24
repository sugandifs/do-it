import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import SignupValidation from "./SignupValidation";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = SignupValidation(values);
    setErrors(err);
    if (err.name === "" && err.email === "" && err.password === "") {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/signup`, values)
        .then((res) => {
          console.log(res);
          navigate("/", { state: { showSignUpAlert: true } });
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
          <div className="flex justify-start">
            <Link
              to="/"
              className="flex items-center rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 leading-6 hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <ChevronLeft className="mr-2" /> Back
            </Link>
          </div>
          <div>
            <img
              src="/check.svg"
              alt="Do It!"
              className="mx-auto text-center h-12 w-auto"
            />
            <h3 className="text-center text-blue-700 font-bold">Do It!</h3>
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="text-sm text-gray-500 mt-5">
            Please allow up to 50 seconds for the server to wake up after
            pressing the 'Create account' button.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  onChange={handleInput}
                  className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                    errors.name ? "border-red-500" : "border-0"
                  }`}
                />
                {errors.name && (
                  <span class="block mt-2 text-sm text-red-500 text-left">
                    Please enter your name
                  </span>
                )}
              </div>
            </div>

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
                  required
                  placeholder="name@example.com"
                  onChange={handleInput}
                  autoComplete="email"
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
                  required
                  autoComplete="current-password"
                  onChange={handleInput}
                  placeholder="Password"
                  className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                    errors.password ? "border-red-500" : "border-0"
                  }`}
                />
                {errors.password && (
                  <span class="block mt-2 text-sm text-red-500 text-left">
                    Your password must be at least 6 characters and include
                    special characters
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
