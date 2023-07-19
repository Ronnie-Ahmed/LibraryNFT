import React from "react";
import { useChain } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";

export const Card = ({ image, tokenId, price, owner, name }) => {
  const chain = useChain();
  const truncatedSeller = `${owner.slice(0, 6)}...${owner.slice(-6)}`;

  return (
    <div>
      <Link to={`/Readbook/${tokenId}`}>
        <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl shadow-cyan-700">
          <div className="transition duration-300 ease-in-out transform hover:scale-105">
            <img
              src={image}
              alt="Card Background"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-28 bg-black bg-opacity-50">
            <div className="text-white text-center">
              <h4 className="text-2xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                Book Title: {name}
              </h4>
              <h2 className="text-xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                Price: {price} {chain.nativeCurrency.symbol}
              </h2>
              <p className="text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
                Owner: {truncatedSeller}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
