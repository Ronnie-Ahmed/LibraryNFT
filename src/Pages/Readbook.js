import React from "react";

import image from "../assets/homebackground.jpg";
import image2 from "../assets/bookloading.gif";
import { Card } from "../Components/Card";
import { deployaddress, contractABI } from "../Components/constants";
import { useState, useRef } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import walletconnect from "../assets/walletconnect.png";
import { ethers } from "ethers";
import axios from "axios";

export const Readbook = () => {
  const buttonRef = useRef(null);
  const status = useConnectionStatus();
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [allNFTsUpdated, setAllNFTsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(deployaddress, contractABI, signer);
      try {
        if (contract !== null) {
          const allnft = await contract.allListedBooks();

          const promises = allnft.map(async (item) => {
            // const tokenuri = await contract.tokenURI(item.tokenId.toNumber());
            const response = await axios.get(item.tokenuri);
            const jsonData = response.data;

            return {
              tokenId: item.tokenId.toString(),
              price: ethers.utils.formatEther(item.accessPrice),
              image: `https://ipfs.io/ipfs/${jsonData.image}`,
              owner: item.bookowner,
              booktitle: jsonData.booktitle,
            };
          });

          const jsonDataArray = await Promise.all(promises);

          if (!dataFetched) {
            try {
              updateData((prev) => [...prev, ...jsonDataArray]);
              updateFetched(true);
            } catch (err) {
              alert("No Properties Found");
            }
          }
          setAllNFTsUpdated(true);
        } else {
          alert("Connect to Metamask");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleButtonClick = () => {
    try {
      fetchData();
      console.log(data);
    } catch (error) {
      alert("No Properties Found");
    }
  };
  if (!allNFTsUpdated) {
    fetchData();
    setAllNFTsUpdated(true);
  }

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
            <h1 className="text-3xl font-bold ">Connect Wallet </h1>
            <h1 className="text-3xl font-bold ">Use Mumbai Testnet </h1>
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
        <section className="flex flex-col md:flex-row  items-center  px-1 md:mx-16 rounded-lg p-4 md:p-8 transform transition-all duration-300 shadow-2xl shadow-black hover:scale-105 mb-8">
          <button ref={buttonRef} onClick={handleButtonClick}></button>
          {data.map((item, key) => (
            <div key={item.tokenId} className="mr-4 ml-4 mb-6">
              <Card
                price={item.price}
                image={item.image}
                tokenId={item.tokenId}
                owner={item.owner}
                name={item.booktitle}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
