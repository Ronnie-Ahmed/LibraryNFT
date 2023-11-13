import React from "react";
import image from "../assets/homebackground.jpg";
import walletconnect from "../assets/walletconnect.png";
import { Card2 } from "../Components/Card2";
import { ethers } from "ethers";
import image2 from "../assets/bookloading.gif";
import { useState, useEffect } from "react";

import {
  useConnectionStatus,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { deployaddress } from "../Components/constants";
export const Userprofile = () => {
  const [pageChainId, setPageChainId] = useState(0);
  const status = useConnectionStatus();
  const { contract } = useContract(deployaddress);
  const { data, isLoading } = useContractRead(contract, "allListedBooks");
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
      className="bg-gray-800 flex justify-center items-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {status === "undefined " ||
      status === "disconnected" ||
      status === "disconnected" ||
      status === "connecting" ? (
        <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
          <div className="flex flex-col items-center m-5">
            <img
              src={walletconnect}
              alt="loading"
              class="w-60 h-60 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
            />
            <h1 className="text-3xl bg-black text-white font-bold ">
              Connect Wallet{" "}
            </h1>
            <h1 className="text-3xl  bg-black text-white font-bold ">
              Use Mumbai Testnet{" "}
            </h1>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
          <div className="flex flex-col items-center">
            <img
              src={image2}
              alt="loading"
              className="w-60 h-60 object-cover rounded-full mb-4"
            />
            <h1 className="text-3xl font-bold">Loading.......</h1>
          </div>
        </div>
      ) : (
        <section className="flex flex-col md:flex-row items-center px-1 md:mx-16 rounded-lg p-4 md:p-8 transform transition-all duration-300 shadow-2xl shadow-black hover:scale-105 mb-8 mt-20 md:mt-0">
          {data.map((item, key) => (
            <div key={item.tokenId.toString()} className="mr-4 ml-4 mb-6">
              <Card2
                accessPrice={ethers.utils.formatEther(item.accessPrice)}
                tokenuri={item.tokenuri}
                tokenId={item.tokenId.toString()}
                bookowner={item.bookowner}
                bookid={item.bookid}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
