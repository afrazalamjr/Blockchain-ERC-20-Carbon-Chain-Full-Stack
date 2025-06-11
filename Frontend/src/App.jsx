import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "./components/ui/button";
import { getCarbonCContract, getMarketplaceContract, getRegistryContract, getProvider, getSigner } from "./web3";
import "./App.css";

function App() {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [balance, setBalance] = useState(0);
  const [emissions, setEmissions] = useState("");
  const [allTxs, setAllTxs] = useState([]);

  // Connect wallet
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask!");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAddress(accounts[0]);
  }

  // Query user balance
  async function fetchBalance() {
    if (!address) return;
    const contract = getCarbonCContract();
    const bal = await contract.balanceOf(address);
    setBalance(ethers.utils.formatEther(bal));
  }

  // Register user role on-chain (Registry contract)
  async function registerRole(selector) {
    const contract = getRegistryContract(getSigner());
    let tx;
    if (selector === "Verifier") tx = await contract.registerVerifier(address);
    else if (selector === "Customer") tx = await contract.registerCustomer(address);
    else if (selector === "CreditHolder") tx = await contract.registerCreditHolder(address);
    await tx.wait();
    setRole(selector);
    alert(`Registered as ${selector}`);
  }

  // Mint new tokens (CreditHolder)
  async function mintTokens(recipient, amount) {
    const contract = getCarbonCContract(getSigner());
    const tx = await contract.mint(recipient, ethers.utils.parseUnits(amount, 18));
    await tx.wait();
    alert("Tokens minted");
  }

  // Buy credits (Customer)
  async function buyCredits() {
    const contract = getMarketplaceContract(getSigner());
    const creditHolder = prompt("Enter CreditHolder address:");
    const tx = await contract.buyCarbonCredits(emissions, creditHolder, { value: 0 });
    await tx.wait();
    alert("Purchase submitted");
  }

  // Fetch all Marketplace transactions
  async function fetchTransactions() {
    const contract = getMarketplaceContract();
    const txns = await contract.getAllTransactions();
    setAllTxs(txns);
  }

  useEffect(() => {
    if (address) fetchBalance();
  }, [address]);

  return (
    <div className="container mx-auto max-w-xl py-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Carbon Credits Marketplace Demo (Sepolia)</h1>
      {!address ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Your Address: <span className="font-mono">{address}</span></p>
          <p>Balance: <span className="font-bold">{balance}</span> CC</p>
          <div className="my-4">
            <label>
              <span className="block">Register as:</span>
              <Button onClick={() => registerRole("Verifier")}>Verifier</Button>
              <Button onClick={() => registerRole("Customer")} variant="outline">Customer</Button>
              <Button onClick={() => registerRole("CreditHolder")} variant="secondary">Credit Holder</Button>
            </label>
          </div>
          <div className="my-4">
            <h2 className="text-xl font-semibold">Mint Tokens (for CreditHolder)</h2>
            <input className="input" type="text" placeholder="Recipient address" id="mintRecipient" />
            <input className="input" type="number" placeholder="Amount" id="mintAmount" />
            <Button onClick={() => mintTokens(document.getElementById("mintRecipient").value, document.getElementById("mintAmount").value)}>
              Mint
            </Button>
          </div>
          <div className="my-4">
            <h2 className="text-xl font-semibold">Buy Credits (for Customer)</h2>
            <input className="input" type="number" value={emissions} onChange={e => setEmissions(e.target.value)} placeholder="Emission Value" />
            <Button onClick={buyCredits}>Buy</Button>
          </div>
          <div className="my-4">
            <Button onClick={fetchTransactions}>View All Transactions</Button>
            <ul>
              {allTxs.map((txn, idx) => (
                <li key={idx} className="border p-2 mt-2">
                  <div>Customer: {txn.customer}</div>
                  <div>Credit Holder: {txn.creditHolder}</div>
                  <div>Tokens: {txn.tokenAmount?.toString?.()}</div>
                  <div>Energy Units: {txn.energyUnits?.toString?.()}</div>
                  <div>Verified: {txn.verified?.toString?.()}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;