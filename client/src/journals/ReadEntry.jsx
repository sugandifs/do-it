import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { ChevronLeft } from "lucide-react";
import Cookies from "js-cookie";

function ReadEntry() {
  const { journal_id } = useParams();
  const [entry, setEntry] = useState([]);
  useEffect(() => {
    const token = Cookies.get("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/entry/` + journal_id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEntry(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!entry) {
    return <div>Loading...</div>;
  }
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
            {entry.title}
          </h5>

          <p className="font-normal text-left text-gray-700 break-words">
            {entry.entry}
          </p>
        </div>
      </div>
    </>
  );
}

export default ReadEntry;
