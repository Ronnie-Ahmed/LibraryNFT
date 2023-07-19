import React, { useState } from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { deployaddress } from "./constants";
import loading2 from "../assets/Loading2.gif";

import { ethers } from "ethers";

export const FormPopup = ({ onClose, onSubmit, paramValue }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { contract } = useContract(deployaddress);
  const { data } = useContractRead(contract, "idtobook", [paramValue]);
  const [accessprice, setaccessprice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Set isLoading to true when the contract call is made
      const newdata = await contract.call("changeBookInfo", [
        paramValue,
        data.bookId,
        data.tokenuri,
        ethers.utils.parseEther(accessprice.toString()),
      ]);
      console.info("contract call successs", newdata);
      alert("Access Price Updated Successfully");
    } catch (err) {
      console.error("contract call failure", err);
    } finally {
      setIsLoading(false); // Set isLoading back to false when the contract call is completed
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="max-w-md mx-auto p-3  duration-300 shadow-2xl shadow-white ">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white bg-black text-center text-sm font-bold mb-2 rounded-md"
              htmlFor="name"
            >
              New AccessPrice
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white text-center leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              onChange={(e) => setaccessprice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            {isLoading ? (
              <button type="button" className="btn btn-primary">
                <div className="transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 rounded-full p-1">
                  <img
                    src={loading2}
                    alt="loading"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Submit
              </button>
            )}

            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
