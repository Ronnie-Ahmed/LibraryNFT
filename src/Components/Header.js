import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ConnectWallet } from "@thirdweb-dev/react";
import nfticon from "../assets/iconlibrary2.jpg";
import { FcHome } from "react-icons/fc";
import { GrTransaction } from "react-icons/gr";
import { FcMoneyTransfer } from "react-icons/fc";
import { useAddress } from "@thirdweb-dev/react";
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(true);
  const address = useAddress();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActive(false);
      } else {
        setActive(true);
      }
    };
    try {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (err) {
      console.log(err);
    }
  }, []);
  try {
    return (
      <header className="fixed top-0 left-0 z-50 text-white py-1 w-full">
        <nav className="flex items-center justify-between px-4 ">
          <Link to="/">
            <div className="flex items-center   hover:border-blue-500 rounded-md p-2 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-800">
              <img
                src={nfticon}
                alt="Logo"
                className="w-8 h-8 mr-2 rounded-full"
              />
              <h1 className="text-xl font-bold text-gray-200">LibraryNFT</h1>
            </div>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" spy={true} smooth={true} offset={-70} duration={500}>
              <button
                className="border border-white border-opacity-50 px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-cyan-600 hover:-translate-y-1 transition-all duration-300 m-1"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FcHome className="inline-block mr-2 text-2xl" />
                <span className="text-l font-bold text-gray-200">Home</span>
              </button>
            </Link>
            <Link
              to="/Readbook"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <button
                className="border border-white border-opacity-50 px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-cyan-600 hover:-translate-y-1 transition-all duration-300 m-1"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <GrTransaction className="inline-block mr-2 text-2xl" />
                <span className="text-l font-bold text-gray-200">
                  Read Books
                </span>
              </button>
            </Link>
            <Link
              to="/Uploadbook"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <button
                className="border border-white border-opacity-50 px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-cyan-600 hover:-translate-y-1 transition-all duration-300 m-1"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FcMoneyTransfer className="inline-block mr-2 text-2xl" />
                <span className="text-l font-bold text-gray-200">
                  Upload Book
                </span>
              </button>
            </Link>
          </div>
          <div className="flex flex-row space-between center p-1">
            {active && <ConnectWallet theme="dark" />}
            {address ? (
              <Link to="/UserProfile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 ml-2 mt-2 text-blue-500 hover:text-purple-500 transition-colors duration-300"
                >
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 11c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
                </svg>
              </Link>
            ) : null}
          </div>

          <div className="md:hidden">
            <button
              className="text-white hover:text-gray-300 bg-black"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="gold"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
        {isOpen && (
          <div className="md:hidden bg-gray-800 py-2 flex flex-col items-center">
            <Link to="/" spy={true} smooth={true} offset={-70} duration={500}>
              <button
                className="border border-white border-opacity-50 px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-cyan-600 hover:-translate-y-1 transition-all duration-300 m-1"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FcHome className="inline-block mr-2 text-2xl" />
                <span className="text-l font-bold text-gray-200">Home</span>
              </button>
            </Link>
            <Link
              to="/Readbook"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <button
                className="border border-white border-opacity-50 px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-cyan-600 hover:-translate-y-1 transition-all duration-300 m-1"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <GrTransaction className="inline-block mr-2 text-2xl" />
                <span className="text-l font-bold text-gray-200">
                  Read Books
                </span>
              </button>
            </Link>
            <Link
              to="/Uploadbook"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <button
                className="border border-white border-opacity-50 px-2 py-1 rounded-md shadow-md hover:shadow-2xl shadow-cyan-600 hover:-translate-y-1 transition-all duration-300 m-1 mb-3"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FcMoneyTransfer className="inline-block mr-2 text-2xl" />
                <span className="text-l font-bold text-gray-200">
                  Upload Book
                </span>
              </button>
            </Link>
            <ConnectWallet theme="dark" />
          </div>
        )}
      </header>
    );
  } catch (err) {
    console.log(err);
  }
};
