import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Cookies from "js-cookie";

function NewEntry() {
  const [values, setValues] = useState({
    title: "",
    entry: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function titleValidation(values) {
    let title_error = {};

    if (values.title === "") {
      title_error.title = "Please enter your entry title";
    }

    return title_error;
  }

  function textValidation(values) {
    let text_error = {};

    if (values.entry === "") {
      text_error.entry = "Please enter your journal entry";
    }

    return text_error;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const title_err = titleValidation(values);
    const text_err = textValidation(values);

    const allErrors = { ...title_err, ...text_err };

    setErrors(allErrors);

    if (!allErrors.title && !allErrors.entry) {
      const token = Cookies.get("token");

      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/journal`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            console.log(res);
            navigate("/journals");
          } else {
            console.log(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleInput = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Navbar page="journals" />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 pt-20">
        <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center mb-6">
            <Link
              to="/journals"
              className="flex items-center rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 leading-6 hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <ChevronLeft className="mr-2" size={20} /> Back
            </Link>
          </div>
          <h5 className="mb-10 text-left text-2xl font-bold tracking-tight text-gray-900">
            Write a new journal entry
          </h5>

          <form onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
              </div>
              <div className="mt-2">
                <div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={handleInput}
                    className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                      errors.title ? "border-red-500" : "border-0"
                    }`}
                  />
                </div>
                {errors.title && (
                  <span className="block mt-2 text-sm text-red-500 text-left">
                    {errors.title}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="text"
                  className="mt-6 block text-sm font-medium leading-6 text-gray-900"
                >
                  Entry
                </label>
              </div>
              <div className="mt-2">
                <div>
                  <textarea
                    id="entry"
                    name="entry"
                    type="text"
                    onChange={handleInput}
                    className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                      errors.entry ? "border-red-500" : "border-0"
                    }`}
                    rows="4"
                  />
                </div>
                {errors.entry && (
                  <span className="block mt-2 text-sm text-red-500 text-left">
                    {errors.entry}
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full mt-10 justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Add entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewEntry;
