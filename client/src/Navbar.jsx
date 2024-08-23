import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ListCheck } from "lucide-react";
import axios from "axios";

function Navbar({ page }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/logout`)
      .then((res) => {
        navigate("/", { state: { showLogoutAlert: true } });
      })
      .catch((err) => console.log(err));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/home"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/check.svg" class="h-8" alt="Do It Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Do It!
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            onClick={handleLogout}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            isOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to="/home"
                className={`block py-2 px-3 rounded md:p-0 ${
                  page === "home"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
                }`}
                aria-current={page === "home" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`block py-2 px-3 rounded md:p-0 ${
                  page === "tasks"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
                }`}
                aria-current={page === "tasks" ? "page" : undefined}
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/journals"
                className={`block py-2 px-3 rounded md:p-0 ${
                  page === "journals"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
                }`}
                aria-current={page === "journals" ? "page" : undefined}
              >
                Journals
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
