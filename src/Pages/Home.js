import image from "../assets/homebackground.jpg";
import walletconnect from "../assets/walletconnect.png";

import { useConnectionStatus } from "@thirdweb-dev/react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const Home = () => {
  const status = useConnectionStatus();
  useEffect(() => {
    changeChainID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageChainId]);
  const changeChainID = async () => {
    try {
      if (status === "connected") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const chainId = await signer.getChainId();
        setPageChainId(chainId);
        if (chainId !== 0x13881) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: "0x13881",
              },
            ],
          });
        }
      }
    } catch (err) {
      // console.log(err);
      if (err.message === "User rejected the request.") {
        alert("Please Connect to Mumbai Testnet");
      }
    }
  };

  return (
    <div
      className="bg-gray-800 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {status === "undefined" ||
      status === "disconnected" ||
      status === "connecting" ? (
        <div className="flex flex-col items-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
          <img
            src={walletconnect}
            alt="loading"
            className="w-60 h-60 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
          />
          <h1 className="text-3xl text-white  bg-black font-bold text-center">
            Connect Wallet
          </h1>
          <h1 className="text-3xl text-white bg-black font-bold text-center">
            Use Mumbai Testnet
          </h1>
        </div>
      ) : (
        <section className="flex flex-col md:flex-row m-5 items-center mx-4 px-1 md:mx-16 rounded-lg p-4 md:p-8 transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
          <div className="mt-4 md:mt-0 text-center">
            <div className="mb-2 md:mb-4 text-center">
              <div className="flex flex-col items-center">
                <Link to="/Readbook">
                  <button className="big-button bg-gradient-to-r from-gray-600 to-gray-900 text-white font-bold text-2xl py-4 px-8 rounded-lg shadow-2xl shadow-black transition-all duration-300">
                    Read Books
                  </button>
                </Link>
                <Link to="/Uploadbook">
                  <button className="big-button bg-gradient-to-r mt-8 from-gray-600 to-gray-900 text-white font-bold text-2xl py-4 px-8 rounded-lg shadow-2xl shadow-black transition-all duration-300">
                    Upload Books
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
