import image from "../assets/homebackground.jpg";
import image2 from "../assets/bookloading.gif";
import walletconnect from "../assets/walletconnect.png";
import loading2 from "../assets/Loading2.gif";
import { FormPopup } from "../Components/FormPopup";

import { useConnectionStatus, useChain, useAddress } from "@thirdweb-dev/react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { deployaddress, contractABI } from "../Components/constants";
import axios from "axios";

export const Bookid = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const status = useConnectionStatus();
  const param = useParams();
  const address = useAddress();
  const [access, setaccess] = useState(false);

  const chain = useChain();
  const [owner, setowner] = useState("");
  const [price, setprice] = useState("");
  const [pdf, setpdf] = useState("");
  const [jsonData, setjsonData] = useState([]);
  const [listData, setlistData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [newloading, setnewloading] = useState(false);
  const truncatedOwner = `${owner.slice(0, 6)}...${owner.slice(-6)}`;

  const handleSubmitForm = (formData) => {
    // Handle the form submission logic here, e.g., send the data to an API
    setIsFormOpen(false); // Close the form popup after submission
  };

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
        const data = await contract.idtobook(param.bookid);
        const bookaccess = await contract.hasAccess(param.bookid);
        setaccess(bookaccess);
        setowner(data.bookowner);
        setprice(ethers.utils.formatEther(data.accessPrice));
        setpdf(data.bookId);
        const response = await axios.get(data.tokenuri);
        setjsonData(response.data);
        const accesslist = await contract.bookAccesslist(param.bookid);
        setlistData(accesslist);
        // setlistData(data.bookowner);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleread = async () => {
    try {
      const ipfsURL = `https://ipfs.io/ipfs/${pdf}`;
      window.open(ipfsURL);
    } catch (err) {
      console.log(err);
    }
  };
  const handlesale = async () => {
    setnewloading(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          deployaddress,
          contractABI,
          signer
        );

        const tx = await contract.getaccess(param.bookid, {
          value: ethers.utils.parseEther(price),
        });
        await tx.wait();
        alert("Transaction Successful");
        const bookaccess = await contract.hasAccess(param.bookid);
        setaccess(bookaccess);
        const accesslist = await contract.bookAccesslist(param.bookid);
        setlistData(accesslist);
      }
    } catch (err) {
      console.log(err);
      alert("Transaction Failed");
    } finally {
      setnewloading(false);
    }
  };
  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  try {
    return (
      <div
        className="bg-gray-800 flex flex-col items-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        {status === "undefined" ||
        status === "disconnected" ||
        status === "disconnected" ||
        status === "connecting" ? (
          <div className="flex items-center justify-center m-5 mx-4 px-1 md:mx-16 rounded-lg transform transition-all duration-300 shadow-2xl shadow-cyan-400 hover:scale-105 mb-8">
            <div className="flex flex-col items-center m-5">
              <img
                src={walletconnect}
                alt="loading"
                className="w-60 h-60 object-cover rounded-full mb-4 transition-transform transform-gpu hover:scale-110"
              />
              <h1 className="text-3xl font-bold">Connect Wallet </h1>
              <h1 className="text-3xl font-bold">Use Mumbai Testnet </h1>
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
              <h1 className="text-3xl font-bold text-white">Loading.......</h1>
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-20">
            <section className="flex flex-col md:flex-row items-center px-1 md:mx-16 rounded-lg p-4 md:p-8 shadow-2xl shadow-cyan-800 mb-8 overflow-hidden mt-2 md:mt-0">
              <div className="flex items-center justify-center md:w-3/5">
                <img
                  src={`https://ipfs.io/ipfs/${jsonData.image}`}
                  alt="Book Cover"
                  className="w-auto h-auto max-h-96 max-w-full mb-2 rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-3/5 md:pl-8 bg-gradient-to-r from-gray-500 to-gray-600 bg-opacity-20 rounded-lg">
                <h2 className="text-3xl font-bold mb-2 mt-2 text-white text-center sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  {jsonData.booktitle}
                </h2>
                <p className="text-lg font-bold mb-4 text-white text-center sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  By {jsonData.name}
                </p>
                <p className="text-lg font-bold mb-4 text-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  Price: {price} {chain.nativeCurrency.symbol}
                </p>
                <p className="text-lg font-bold mb-4 text-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  Owned by: {truncatedOwner}
                </p>
                <p className="text-lg mb-8 text-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  <span className="font-bold">Book Overview:</span>{" "}
                  {jsonData.description}
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center mb-2 space-y-4 md:space-y-0 md:space-x-4">
                  {(owner === address || access) && newloading === false ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md border-2 border-blue-500 transition-all duration-300 shadow-md backdrop-filter backdrop-blur-md bg-opacity-70 w-1/3 md:w-auto text-base md:text-lg lg:text-xl xl:text-2xl"
                      onClick={handleread}
                    >
                      Read Book
                    </button>
                  ) : newloading ? (
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
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md border-2 border-red-500 transition-all duration-300 shadow-md backdrop-filter backdrop-blur-md bg-opacity-70 w-1/3 md:w-auto text-base md:text-lg lg:text-xl xl:text-2xl"
                      onClick={handlesale}
                    >
                      Buy Now
                    </button>
                  )}
                  {address === owner && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md border-2 border-green-500 transition-all duration-300 shadow-md backdrop-filter backdrop-blur-md bg-opacity-70 w-1/3 md:w-auto text-base md:text-lg lg:text-xl xl:text-2xl"
                      onClick={() => setIsFormOpen(true)}
                    >
                      Open Form
                    </button>
                  )}
                  {isFormOpen && (
                    <FormPopup
                      onClose={() => setIsFormOpen(false)}
                      paramValue={param.bookid}
                      onSubmit={handleSubmitForm}
                    />
                  )}
                </div>
              </div>
            </section>
            <div className="flex justify-center mb-2">
              <div className="w-full max-w-md">
                <table className="w-full bg-gray-800 text-white rounded-xl">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">
                        List of Addresses that Have Access to this Book
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map((item, index) => (
                      <tr key={index} className="bg-gray-700">
                        <td className="py-2 px-4 border-b text-center font-bold">
                          Address: {item}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.log(err);
  }
};
