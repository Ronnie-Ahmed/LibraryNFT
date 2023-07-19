import React from "react";
import { useChain } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { deployaddress, contractABI } from "../Components/constants";
import { ethers } from "ethers";

export const Card2 = ({
  accessPrice,
  tokenuri,
  tokenId,
  bookowner,
  bookid,
}) => {
  const address = useAddress();
  const chain = useChain();
  const [data, setdata] = useState([]);
  const [access, setaccess] = useState(false);

  const truncatedSeller = `${bookowner.slice(0, 6)}...${bookowner.slice(-6)}`;

  const fetchdata = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          deployaddress,
          contractABI,
          signer
        );
        const bookaccess = await contract.hasAccess(tokenId);
        setaccess(bookaccess);
        axios
          .get(tokenuri)
          .then((response) => {
            const jsondata = response.data;
            setdata(jsondata);

            // Handle successful response
          })
          .catch((error) => {
            // Handle error
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {access ? (
        <div style={{ marginBottom: "10px" }}>
          <h1 className="bg-black text-white font-bold text-center mb-1">
            HAVE ACCESS
          </h1>
          <Link to={`/Readbook/${tokenId}`}>
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl shadow-cyan-700">
              <div className="transition duration-300 ease-in-out transform hover:scale-105">
                <img
                  src={`https://ipfs.io/ipfs/${data.image}`}
                  alt="Card Background"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-28 bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <h4 className="text-2xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Book Title: {data.booktitle}
                  </h4>
                  <h2 className="text-xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Price: {accessPrice} {chain.nativeCurrency.symbol}
                  </h2>
                  <p className="text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Owner: {truncatedSeller}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : null}

      {address === bookowner ? (
        <div>
          <h1 className="bg-black font-bold text-white text-center mb-1">
            OWNED
          </h1>
          <Link to={`/Readbook/${tokenId}`}>
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl shadow-cyan-700">
              <div className="transition duration-300 ease-in-out transform hover:scale-105">
                <img
                  src={`https://ipfs.io/ipfs/${data.image}`}
                  alt="Card Background"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-28 bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <h4 className="text-2xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Book Title: {data.booktitle}
                  </h4>
                  <h2 className="text-xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Price: {accessPrice} {chain.nativeCurrency.symbol}
                  </h2>
                  <p className="text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
                    Owner: {truncatedSeller}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  );
};
