import React from "react";
import image from "../assets/homebackground.jpg";
import walletconnect from "../assets/walletconnect.png";
import loading2 from "../assets/Loading2.gif";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import nfticon from "../assets/iconlibrary2.jpg";
import {
  useAddress,
  useContract,
  useConnectionStatus,
} from "@thirdweb-dev/react";

import { deployaddress } from "../Components/constants";
import { useState } from "react";
import { ethers } from "ethers";

const projectId = "2NUvwy5K9EzmrmotQqVH303hmvV";
const projectSecret = "645df3033ab65599cf00069126867730";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const Uploadbook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const walletaddress = useAddress();
  const { contract } = useContract(deployaddress);
  const status = useConnectionStatus();
  const [formdata, setformdata] = useState({
    booktitle: "",
    accessprice: "",
    authoraddress: walletaddress,
    authorname: "",
    description: "",
  });

  const [imgurl, setimgurl] = useState(null);
  const [pdfurl, setpdfurl] = useState(null);

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formdata);
    const { authorname, booktitle, accessprice, description } = formdata;
    const bufferpdf = await pdfurl.arrayBuffer();
    const buffer = await imgurl.arrayBuffer();
    const { cid } = await ipfs.add(buffer);
    const resultpdf = await ipfs.add({
      path: cid.toString(),
      content: Buffer.from(bufferpdf),
    });
    // console.log(`${resultpdf.cid.toString()}`);
    const info = {
      name: authorname,
      booktitle: booktitle,
      description: description,
      price: accessprice,
      image: cid.toString(),
      pdf: resultpdf.cid.toString(),
    };
    const result = await ipfs.add({
      path: cid.toString(),
      content: Buffer.from(JSON.stringify(info)),
    });
    console.log(`${result.cid.toString()}`);
    const listingfee = await contract.call("getListingFee");
    try {
      const data = await contract.call(
        "mintbook",
        [
          ethers.utils.parseEther(accessprice),
          `https://ipfs.io/ipfs/${result.cid.toString()}`,
          resultpdf.cid.toString(),
        ],
        { value: listingfee.toString() }
      );
      console.info("contract call successs", data);
      alert("Book Minted Successfully");
    } catch (err) {
      console.error("contract call failure", err);
    } finally {
      setIsLoading(false); // Set isLoading back to false when the contract call is completed
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
            <h1 className="text-3xl font-bold ">Connect Wallet </h1>
            <h1 className="text-3xl font-bold ">Use Mumbai Testnet </h1>
          </div>
        </div>
      ) : (
        <section className="flex flex-col md:flex-row m-5 items-center mx-2 px-1 md:mx-16 rounded-lg p-4 md:p-8 transform transition-all duration-300 shadow-2xl shadow-black hover:scale-105 mb-8">
          <div className="max-w-md mx-auto p-3 transform transition-all duration-300 shadow-2xl shadow-white hover:scale-105 mb-8">
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex justify-center">
                <img
                  src={nfticon}
                  alt="logo"
                  className="w-full h-32 object-center object-cover my-2"
                />
              </div>
              <div>
                <label
                  htmlFor="account"
                  className="block text-white font-bold mb-1 text-center bg-black"
                >
                  Book Title
                </label>
                <input
                  type="text"
                  name="booktitle"
                  value={formdata.booktitle}
                  onChange={handleChange}
                  placeholder="Name of the Book"
                  className="shadow appearance-none border rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline bg-cyan-950"
                  required
                />
              </div>

              <div className="mt-2">
                <label
                  htmlFor="amount"
                  className="block text-white font-bold mb-1 text-center bg-black"
                >
                  Access Price
                </label>
                <input
                  type="number"
                  name="accessprice"
                  value={formdata.accessprice}
                  onChange={handleChange}
                  placeholder="Initial Access Price"
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="0" // Add the min attribute to prevent negative values
                />
              </div>

              <div className="mt-2">
                <label className="block text-white font-bold mb-1 text-center bg-black">
                  Address of the Author
                </label>
                <input
                  type="text"
                  name="authoraddress"
                  value={formdata.authoraddress}
                  onChange={handleChange}
                  placeholder={
                    formdata.accountaddress
                      ? formdata.accountaddress
                      : "No wallet connected"
                  }
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="Author Name"
                  className="block text-white font-bold mb-1 text-center bg-black"
                >
                  Author Name
                </label>
                <input
                  type="text"
                  name="authorname"
                  value={formdata.authorname}
                  onChange={handleChange}
                  placeholder="Name of the Author"
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="amount"
                  className="block text-white font-bold mb-1 text-center bg-black"
                >
                  Description
                </label>
                <textarea
                  type="string"
                  name="description"
                  value={formdata.description}
                  placeholder="Overview of the Book"
                  onChange={handleChange}
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="amount"
                  className="block text-white font-bold mb-1 text-center bg-black"
                >
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => {
                    setimgurl(e.target.files[0]);
                  }}
                  required
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="amount"
                  className="block text-white font-bold mb-1 text-center bg-black"
                >
                  File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain"
                  className="shadow appearance-none border bg-cyan-950 rounded w-full py-1 px-2 text-white leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => {
                    setpdfurl(e.target.files[0]);
                  }}
                  required
                />
              </div>
              <div className="flex justify-center mt-8">
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
                ) : walletaddress ? (
                  <button
                    type="submit"
                    className="btn btn-primary text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-30"
                  >
                    Mint NFT
                  </button>
                ) : (
                  <p className="btn btn-primary text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-30">
                    CONNECT WALLET FIRST
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};
