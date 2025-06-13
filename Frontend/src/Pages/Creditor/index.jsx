import { useState, useEffect } from "react";
import { getCarbonCContract, getSigner, formatEther, parseEther } from "../../web3";
import { createTransaction, getTransactions } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export const CreditorPage = ({ address }) => {
  const [balance, setBalance] = useState(0);
  const [mintAmount, setMintAmount] = useState("");
  const [mintRecipient, setMintRecipient] = useState("");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [address]);

  const fetchBalance = async () => {
    const contract = getCarbonCContract();
    const bal = await contract.balanceOf(address);
    setBalance(formatEther(bal));
  };

  const fetchTransactions = async () => {
    const { txns } = await getTransactions();
    setTransactions(txns);
  };

  const mintTokens = async () => {
    try {
      const contract = getCarbonCContract(await getSigner());
      const tx = await contract.mint(mintRecipient, parseEther(mintAmount));
      await tx.wait();
      
      // Record in backend
      await createTransaction({
        type: "MINT",
        from: address,
        to: mintRecipient,
        amount: mintAmount,
        timestamp: new Date().toISOString()
      });
      
      alert("Tokens minted successfully");
      fetchBalance();
      fetchTransactions();
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed: " + error.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Credit Holder Dashboard</h1>
      <p className="mb-4">Your balance: {balance} CC</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Mint New Tokens</h2>
        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Recipient address"
            value={mintRecipient}
            onChange={(e) => setMintRecipient(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            type="number"
            placeholder="Amount"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={mintTokens}
          >
            Mint Tokens
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions.map((tx, index) => (
            <div key={index} className="border p-3 rounded">
              <p>Type: {tx.type}</p>
              <p>From: {tx.from}</p>
              <p>To: {tx.to}</p>
              <p>Amount: {tx.amount}</p>
              <p>Date: {new Date(tx.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};