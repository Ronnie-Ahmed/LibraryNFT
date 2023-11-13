import "./App.css";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { Allroutes } from "./Components/Allroutes";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const status = useConnectionStatus();

  const [pageChainId, setPageChainId] = useState(0);

  const changeChainID = async () => {
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
  };

  useEffect(() => {
    changeChainID();
  }, [pageChainId]);
  return (
    <div>
      <Header />
      <div className="bg-gray-400">
        <Allroutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
