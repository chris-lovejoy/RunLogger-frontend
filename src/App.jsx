import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/RunLogger.json";


const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "0x9176BA9f632f07472DE14C156f198630C3dE2A42";
  const contractABI = abi.abi;
  
    const checkIfWalletIsConnected = async () => {
        try {
          const { ethereum } = window;
    
          if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
          } else {
            console.log("We have the ethereum object", ethereum);
          }
    
          /*
          * Check if we're authorized to access the user's wallet
          */
          const accounts = await ethereum.request({ method: "eth_accounts" });
    
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account)
          } else {
            console.log("No authorized account found")
          }
        } catch (error) {
          console.log(error);
        }
      }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(() => {
  checkIfWalletIsConnected();
  }, [])
      
  const logRun = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const runLogPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let distance = await runLogPortalContract.getRunDistance();
        console.log("Total distance run before this run is \%d miles.", distance.toNumber());

        const newRun = await runLogPortalContract.addRun(10);
        // TODO: modify to enable distance to be specified
        console.log("Mining...", newRun.hash);
        
        await newRun.wait();
        console.log("Mined -- ", newRun.hash);

        distance = await runLogPortalContract.getRunDistance();
        console.log("Total distance run after this run is \%d miles.", distance.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkDistance = async () => {
     try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const runLogPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Retrieving total distance run...")
        let distance = await runLogPortalContract.getRunDistance();
        console.log("You've run a total of \%d miles", distance.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
   return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👟 Let's get running!
        </div>

        <div className="bio">
        Log your runs and keep yourself accountable with friends.    
        </div>
        
      {!currentAccount && (
      <>
        <div className="bio">
          Connect your Ethereum wallet to get started! 
        </div>
        <button className="runButton" onClick={connectWallet}>
            Connect Wallet
          </button>
          </>
      )}
        
        

        <button className="runButton" onClick={logRun}>
          Log a run (default 10 miles 😉)
        </button>
        <button className="runButton" onClick={checkDistance}>
          Check how far you've run
        </button>

        
      </div>
    </div>
  );
}


export default App
