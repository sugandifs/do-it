import React, { useState, useEffect } from "react";
import { BookPlus, MoveRight } from "lucide-react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Journals() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setName(res.data.name);
        } else {
          navigate("/");
        }
      })
      .then((err) => console.log(err));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar page="journals" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-left text-3xl font-semibold leading-9 tracking-tight text-gray-900">
            {name}'s Journal Entries
          </h1>
          <Link
            to="/write"
            className="flex ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            <BookPlus size={20} className="mr-3" /> Write a New Entry
          </Link>
        </div>
        <div className="mt-10 w-full">
          <div className="flex flex-wrap justify-center mt-10">
            {data.length === 0 ? (
              <h1>You have no entries.</h1>
            ) : (
              data.map((journal) => (
                <div key={journal.title} className="p-4 max-w-sm">
                  <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                    <div className="flex items-center mb-3">
                      <h2 className="text-gray-800 text-lg font-medium">
                        {journal.title}
                      </h2>
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <p
                        className="text-base text-gray-700 text-left overflow-hidden text-ellipsis"
                        style={{
                          whiteSpace: "pre-wrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {journal.entry}
                      </p>
                      <p className="text-sm text-gray-500 mt-3 text-left">
                        {formatDate(journal.date)}
                      </p>
                      <Link
                        to={`/entry/${journal._id}`}
                        className="mt-3 text-sm text-blue-700 hover:text-blue-400 inline-flex items-center"
                      >
                        Read Full Entry
                        <MoveRight className="ml-3" size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Journals;
