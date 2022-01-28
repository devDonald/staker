import "./App.css";
import Navbar from "./components/Navbar";

import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import staker from "./contracts/staker.abi.json";
import IERC from "./contracts/ierc.abi.json";
import Stocks from "./components/Stocks";
import AddStock from "./components/AddStock";
import Notification from "./components/Notification";

const ERC20_DECIMALS = 18;

const contractAddress = "0x6dAfeeD13B16C65722F0Ad8445A8Dfd1E1716Eb2";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [stakes, setStakes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  let notification;

  const celoConnect = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        // removed await
        setAddress(user_address);
        setKit(kit);
      } catch (error) {
        // removed error console.log and pushed error to notification
        notification = error;
      }
    } else {
      // send notice on failed connection
      notification = "Couldn't make connection to CELO";
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(staker, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      // removed error console.log and pushed error to notification
      notification = error;
    }
  }, [address, kit]);
  const getStocks = async () => {
    const stakeLength = await contract.methods.getStakeLength().call();
    const _stakes = [];

    for (let index = 0; index < stakeLength; index++) {
      let _stake = new Promise(async (resolve, reject) => {
        let stake = await contract.methods.getStake(index).call();
        resolve({
          index: index,
          owner: stake[0],
          percentage: stake[1],
          price: stake[2],
          canVote: stake[3],
          isBought: stake[4],
        });
      });
      _stakes.push(_stake);
    }
    const stakes = await Promise.all(_stakes);
    setStakes(stakes);
  };

  const buyStock = async (_index) => {
    const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    try {
      const price = new BigNumber(stakes[_index].price)
        .shiftedBy(ERC20_DECIMALS)
        .toString();
      await cUSDContract.methods
        .approve(contractAddress, price)
        .send({ from: address });
      await contract.methods.buyStake(_index).send({ from: address });
      getBalance();
      getStocks();
    } catch (error) {
      // removed error console.log and pushed error to notification
      notification = error;
    }
  };

  const sellStock = async (_index) => {
    try {
      await contract.methods.sellStake(_index).send({ from: address });
      getBalance();
      getStocks();
    } catch (error) {
      // removed error console.log and pushed error to notification
      notification = error;
    }
  };

  const checkIfAdmin = async (address) => {
    try {
      const admin = await contract.methods.isUserAdmin(address).call();
      setIsAdmin(admin);
    } catch (error) {
      // removed error console.log and pushed error to notification
      notification = error;
    }
  };

  const addStocks = async (_percentage, _price) => {
    try {
      await contract.methods
        .addStake(_percentage, _price)
        .send({ from: address });
    } catch (error) {
      // removed error console.log and pushed error to notification
      notification = error;
    }
    getStocks();
  };

  useEffect(() => {
    celoConnect();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    } else {
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      checkIfAdmin(address);
      getStocks();
    }
  }, [contract]);
  return (
    <div>
      <Navbar balance={cUSDBalance} />
      {notification && <Notification msg={notification} />}
      <Stocks
        stocks={stakes}
        isAdmin={isAdmin}
        buyShares={buyStock}
        sellShares={sellStock}
        address={address}
      />
      {isAdmin && <AddStock addStocks={addStocks} />}
    </div>
  );
}

export default App;
